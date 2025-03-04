"use client";
import * as z from "zod";
import axios from "axios";
import {   File, Loader2, PlusCircle, X } from "lucide-react";
import { useState } from "react";
import {toast} from "react-toastify";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { Attachment, Course } from "@prisma/client";
import "@uploadthing/react/styles.css";


import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";


interface AttachmentFormProps {
    initialData:Course & { attachments: Attachment[]};
    courseId : string;
};

const formSchema = z.object({
    url: z.string().min(1),
})
if(!formSchema){} 

export const AttachmentForm = ({
    initialData,
    courseId
}: AttachmentFormProps ) => {
    const [isEditting,setIsEditting] = useState(false);
    const [deletingId,setDeletingId] = useState<string | null>(null);
    const {userId} =useAuth();

    const toggleEdit = () =>setIsEditting((current) =>!current);

    const router = useRouter();

    const onSubmit = async (values: z.infer<typeof formSchema>)=>{
        try {
            const formData={
                ...values,
                "userId":userId
            }
            await axios.post(`${process.env.NEXT_PUBLIC_APP_URL}/api/courses/${courseId}/attachments`,formData);
            toast.success("course updated");
            toggleEdit();
            router.refresh();
        } catch {
            toast.error("something went wrong")
        }
    }

    const onDelete = async(id:string) =>{
        try {
            setDeletingId(id);
            await axios.delete(`${process.env.NEXT_PUBLIC_APP_URL}/api/courses/${courseId}/attachments/${id}`);
            toast.success("Attachment deleted");
            router.refresh();
        } catch {
            toast.error("Something went wrong");
        }finally{
            setDeletingId(null);
        }
    }

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Course Attachments
                <Button onClick={toggleEdit} variant={"ghost"}>
                    {isEditting && (
                        <>Cancel</>
                    )}
                    {!isEditting && (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2"/>
                            Add a file
                        </>
                    )}
                </Button>
            </div>
            {!isEditting && (
               <>
                {initialData.attachments.length === 0 && (
                    <p className="text-sm mt-2 text-slate-500 italic">
                        No attachments yet
                    </p>
                )}
                {initialData.attachments.length > 0 && (
                    <div className="space-y-2">
                        {initialData.attachments.map((attachment)=>(
                            <div
                                key={attachment.id}
                                className="flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md"
                            >
                                <File className="h-4 w-4 mr-2 flex-shrink-0"/>
                                <div className="text-xs line-clamp-1">
                                    {attachment.name}
                                </div>
                                {deletingId === attachment.id && (
                                    <div>
                                        <Loader2 className="h-4 w-4 animate-spin"/>
                                    </div>
                                )}
                                {deletingId !== attachment.id && (
                                    <Button
                                        onClick={()=> onDelete(attachment.id)}
                                        className="ml-auto hover:opacity-75 transition"
                                    >
                                        <X className="h-4 w-4 "/>
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
               </>
            )}
            {
                isEditting && (
                    <div>
                        <FileUpload
                            endpoint="courseAttachment"
                            onChange={(url)=>{
                                if(url){
                                    onSubmit({url:url});
                                }
                            }}
                        />
                        <div className="text-xs text-muted-foreground mt-4">
                            Add attachments that students need for this course.
                        </div>
                    </div>
                )
            }
        </div>
    )
}