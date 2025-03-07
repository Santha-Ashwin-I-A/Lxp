"use client";
import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {  Loader2, PlusCircle } from "lucide-react";
import { useState } from "react";
import {toast} from "react-toastify";
import { useRouter } from "next/navigation";

import { Form, FormControl,FormField,FormItem,FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";
import { Chapter, Course } from "@prisma/client";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { ChaptersList } from "./chapters-list";


interface ChaptersFormProps {
    initialData:Course & { Chapters: Chapter[]};
    courseId : string;
};

const formSchema = z.object({
    title: z.string().min(1)
});

export const ChaptersForm =({
    initialData,
    courseId
}:ChaptersFormProps)=>{
    const [isCreating,setIsCreating] = useState(false);
    const [isUpdating,setIsUpdating] = useState(false);
    const {userId} =useAuth();

    const toggleCreating = () => setIsCreating((current) =>!current);

    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues:{
            title: "",
            }
    });

    const {isSubmitting,isValid} = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>)=>{
        try {
            const formData={
                ...values,
                "userId":userId
            }
            await axios.post(`${process.env.NEXT_PUBLIC_APP_URL}/api/courses/${courseId}/chapters`,formData);
            toast.success("Chapter created");
            toggleCreating();
            router.refresh();
        } catch {
            toast.error("something went wrong")
        }
    }

    const onReorder = async(updateData: {id:string; position:number}[] ) =>{
        try {
            setIsUpdating(true);

            await axios.put(`${process.env.NEXT_PUBLIC_APP_URL}/api/courses/${courseId}/chapters/reorder`,{
                list: updateData,
                userId:userId
            })
            toast.success("Chapters reordered");
            router.refresh();
        } catch  {
            toast.error("something went wrong");
        }finally{
            setIsUpdating(false);
        }
    }

    const onEdit = (id: string) =>{
        router.push(`/teacher/courses/${courseId}/chapters/${id}`);
    }

    return (
        <div className="relative mt-6 border bg-slate-100 rounded-md p-4">
            {isUpdating && (
                <div className="absolute h-full w-full bg-slate-500/20 top-0 right-0 rounded-md flex items-center justify-center ">
                    <Loader2 className="animate-spin h-6 w-6 text-sky-700"/>
                </div>
            )}
            <div className="font-medium flex items-center justify-between">
                Course chapters
                <Button onClick={toggleCreating} variant={"ghost"}>
                    {isCreating ? (<>Cancel</>)
                    : (<>
                    <PlusCircle  className="h-4 w-4 mr-2"/>
                    Add a chapter
                    </>
                    )}
                </Button>
            </div>
            {isCreating && (
                    <Form {...form}>
                        <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 mt-4"
                        >
                            <FormField 
                            control ={form.control}
                            name="title"
                            render={({field})=>(
                                <FormItem>
                                    <FormControl>
                                        <Input
                                        disabled={isSubmitting}
                                        placeholder="e.g.'Introdution to course'"
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
                                    Create
                                </Button>
                            </div>
                        </form>
                    </Form>
                )}
                {!isCreating &&(
                    <div className={cn(
                        "text-sm mt-2 ",
                        !initialData.Chapters.length && "text-slate-500 italic"
                    )}>
                       { !initialData.Chapters.length && "No chapters"}
                       <ChaptersList
                            onEdit={onEdit}
                            onReorder={onReorder}
                            items={initialData.Chapters || []}
                       />
                    </div>
                )}
                {!isCreating && (
                    <p className="text-xs text-muted-foreground mt-4">
                        Drag and drop to reorder the chapters
                    </p>
                )}
        </div>
    )
}