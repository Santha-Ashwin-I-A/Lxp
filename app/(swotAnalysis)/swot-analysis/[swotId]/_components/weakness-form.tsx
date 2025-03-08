"use client";
import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil } from "lucide-react";
import { useState } from "react";
import {toast} from "react-toastify";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

import { Form, FormControl,FormField,FormItem,FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Swot } from "@prisma/client"
import {  useSession } from "@clerk/nextjs";

interface WeaknessFormProps {
    swot: Swot;
    swotId: string;
}

const formSchema = z.object({
    weaknesses: z.string().min(1,{
        message:"weaknesses is required"
    })
})

export const WeaknessForm = ({
    swot,
    swotId
}:WeaknessFormProps) =>{
    const [isEditting,setIsEditting] = useState(false);
    const user = useSession();
    const userId = user.session?.id;
    const toggleEdit = () =>setIsEditting((current) =>!current);

    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues:{
            weaknesses: swot?.weaknesses || ""
            }
    });

    const {isSubmitting,isValid} = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>)=>{
        try {
            const formData={
                ...values,
                "userId":userId
            }
            await axios.patch(`${process.env.NEXT_PUBLIC_APP_URL}/api/swot/${swotId}`,formData);
            toast.success("strength updated");
            toggleEdit();
            router.refresh();
        } catch {
            toast.error("something went wrong")
        }
    }

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                weaknesses
                <Button onClick={toggleEdit} variant={"ghost"}>
                    {isEditting ? (<>Cancel</>)
                    : (<>
                    <Pencil  className="h-4 w-4 mr-2"/>
                    Edit weaknesses
                    </>
                    )}
                </Button>
            </div>
            {!isEditting &&(
                <p className={cn(
                    "text-sm mt-2",
                    !swot?.weaknesses && "text-slate-500 italic"
                )}>
                    {swot?.weaknesses || "Yet to give strength"}
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
                            name="weaknesses"
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