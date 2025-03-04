"use client";
import * as z from "zod";
import axios from "axios";
import { ImageIcon, Pencil, PlusCircle } from "lucide-react";
import { useState } from "react";
import {toast} from "react-toastify";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { Course } from "@prisma/client";
import "@uploadthing/react/styles.css";


import { Button } from "@/components/ui/button";
import Image from "next/image";
import { FileUpload } from "@/components/file-upload";


interface ImageFormProps {
    initialData:Course;
    courseId : string;
};

const formSchema = z.object({
    imageUrl: z.string().min(1,{
        message:"image is required"
    })
})
if(!formSchema){} 

export const ImageForm = ({
    initialData,
    courseId
}: ImageFormProps ) => {
    const [isEditting,setIsEditting] = useState(false);
    const {userId} =useAuth();

    const toggleEdit = () =>setIsEditting((current) =>!current);

    const router = useRouter();

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
                Course image
                <Button onClick={toggleEdit} variant={"ghost"}>
                    {isEditting && (
                        <>Cancel</>
                    )}
                    {!isEditting && !initialData.imageUrl &&(
                        <>
                            <PlusCircle className="h-4 w-4 mr-2"/>
                            Add an image
                        </>
                    )}
                    {!isEditting && initialData.imageUrl &&(
                        <>
                            <Pencil  className="h-4 w-4 mr-2"/>
                            Edit image
                        </>
                    )}
                </Button>
            </div>
            {!isEditting && (
                !initialData.imageUrl ? (
                    <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
                        <ImageIcon className="h-10 w-10 text-slate-500"/>
                    </div>
                ) : (
                    <div className="relative aspect-video mt-2">
                        <Image
                            alt="upload"
                            fill
                            className="object-cover rounded-md"
                            src={initialData.imageUrl}
                        />
                    </div>
                )
            )}
            {
                isEditting && (
                    <div>
                        <FileUpload
                            endpoint="courseImage"
                            onChange={(url)=>{
                                if(url){
                                    onSubmit({imageUrl:url});
                                }
                            }}
                        />
                        <div className="text-xs text-muted-foreground mt-4">
                            16:8 aspect ratio recommended
                        </div>
                    </div>
                )
            }
        </div>
    )
}