"use client";
import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil } from "lucide-react";
import { useState } from "react";
import {toast} from "react-toastify";
import { useRouter } from "next/navigation";

import { Form, FormControl,FormField,FormItem,FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@clerk/nextjs";
import { Course } from "@prisma/client";
import { cn } from "@/lib/utils";


interface DescriptionFormProps {
    initialData:Course;
    courseId : string;
};

const formSchema = z.object({
    description: z.string().min(1,{
        message:"description is required"
    })
})

export const DescriptionForm =({
    initialData,
    courseId
}:DescriptionFormProps)=>{
    const [isEditting,setIsEditting] = useState(false);
    const {userId} =useAuth();

    const toggleEdit = () =>setIsEditting((current) =>!current);

    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues:{
            description:  initialData?.description || ""
            }
    });

    const {isSubmitting,isValid} = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>)=>{
        try {
            const formData={
                ...values,
                "userId":userId
            }
            await axios.patch(`${process.env.NEXT_PUBLIC_APP_URL}/api/courses/${courseId}`,formData);
            toast.success("course updated");
            toggleEdit();
            router.refresh();
        } catch {
            toast.error("something went wrong")
        }
    }

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Course description
                <Button onClick={toggleEdit} variant={"ghost"}>
                    {isEditting ? (<>Cancel</>)
                    : (<>
                    <Pencil  className="h-4 w-4 mr-2"/>
                    Edit description
                    </>
                    )}
                </Button>
            </div>
            {!isEditting &&(
                <p className={cn(
                    "text-sm mt-2",
                    !initialData.description && "text-slate-500 italic"
                )}>
                    {initialData.description || "No description"}
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
                            name="description"
                            render={({field})=>(
                                <FormItem>
                                    <FormControl>
                                        <Textarea
                                        disabled={isSubmitting}
                                        placeholder="e.g.'This course is about'"
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