"use client";

import { ConfirmModal } from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

interface ChapterActionsProps {
    disabled: boolean;
    courseId: string;
    chapterId: string;
    isPublished:boolean;
}

export const ChapterActions =({
    disabled,
    courseId,
    chapterId,
    isPublished
}:ChapterActionsProps)=>{
    const router = useRouter();
    const [isloading,setIsloading] = useState(false);

    const onClick = async() =>{
        try {
            setIsloading(true);
            if(isPublished){
                await axios.patch(`${process.env.NEXT_PUBLIC_APP_URL}/api/courses/${courseId}/chapters/${chapterId}/unpublish`);
                toast.success("chapter Unpublished");
            }
            else{
                await axios.patch(`${process.env.NEXT_PUBLIC_APP_URL}/api/courses/${courseId}/chapters/${chapterId}/publish`);
                toast.success("chapter published");
            }
            router.refresh();
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsloading(false);
        }
    };

    const onDelete = async() =>{
        try {
            setIsloading(true);

            await axios.delete(`http://localhost:3000/api/courses/${courseId}/chapters/${chapterId}`);

            toast.success("chapter deleted");
            router.refresh();
            router.push(`/teacher/courses/${courseId}`);
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsloading(false);
        }
    }

    return(
        <div className="flex  items-center gap-x-2">
            <Button
                onClick={onClick}
                disabled={disabled || isloading}
                variant={"outline"}
                size={"sm"}
            >
                {isPublished ? "Unpublished" : "publish"}
            </Button>
            <ConfirmModal onConfirm={onDelete}>
                <Button size={"sm"} disabled={isloading}>
                    <Trash className="h-4 w-4"/>
                </Button>
            </ConfirmModal>
        </div>
    )
}