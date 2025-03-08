"use client";
import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil } from "lucide-react";
import { useState } from "react";
import {toast} from "react-toastify";
import { redirect, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

import { Form, FormControl,FormField,FormItem,FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Swot } from "@prisma/client"
import {  useSession } from "@clerk/nextjs";

interface StrengthFormProps {
    swot: Swot;
    swotId:string;
}

const formSchema = z.object({
    strengths: z.string().min(1,{
        message:"strengths is required"
    })
})

export const StrengthForm = ({
    swot,
    swotId,
}:StrengthFormProps) =>{
    const [isEditting,setIsEditting] = useState(false);
    const user = useSession();
    const userId = user.session?.id;
    if(!userId){
        return redirect("/swot-analysis")
    }
    const toggleEdit = () =>setIsEditting((current) =>!current);

    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues:{
            strengths: swot?.strengths || ""
            }
    });

    const {isSubmitting,isValid} = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>)=>{
        try {
            const formData={
                ...values,
                "userId":userId
            }
            
            const res = await axios.patch(`${process.env.NEXT_PUBLIC_APP_URL}/api/swot/${swotId}`,formData);
            console.log("finish")
            toast.success("strength updated");
            toggleEdit();
            router.refresh();
        } catch(error) {
            console.log(error)
            toast.error("something went wrong")
        }
    }

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Strengths
                <Button onClick={toggleEdit} variant={"ghost"}>
                    {isEditting ? (<>Cancel</>)
                    : (<>
                    <Pencil  className="h-4 w-4 mr-2"/>
                    Edit strengths
                    </>
                    )}
                </Button>
            </div>
            {!isEditting &&(
                <p className={cn(
                    "text-sm mt-2",
                    !swot?.strengths && "text-slate-500 italic"
                )}>
                    {swot?.strengths || "Yet to give strength"}
                </p>
            )}
            {
                isEditting && (
                    <Form {...form}>
                        <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 mt-4"
                        >
                            <FormField 
                            control ={form.control}
                            name="strengths"
                            render={({field})=>(
                                <FormItem>
                                    <FormControl>
                                        <Textarea
                                        disabled={isSubmitting}
                                        placeholder="e.g.'I'm very strong in coding'"
                                        {...field}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                            />
                            <div className="flex items-center gap-x-2">
                                <Button 
                                disabled={!isValid || isSubmitting}
                                type="submit"
                                >
                                    Save
                                </Button>
                            </div>
                        </form>
                    </Form>
                )
            }
        </div>
    )
}