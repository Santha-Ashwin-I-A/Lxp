"use client";

import { Button } from "@/components/ui/button";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import axios from "axios";
import { CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

interface CourseProgressButtonProps {
    chapterId: string;
    courseId: string;
    isCompleted?: boolean;
    nextChapterId?: string;
}

export const CourseProgressButton =({
    chapterId,
    courseId,
    isCompleted,
    nextChapterId,
}:CourseProgressButtonProps)=>{
    const router = useRouter();
    const confetti = useConfettiStore();
    const [isLoading,setIsLoading] = useState(false);

    const Icon = isCompleted ? XCircle : CheckCircle;

    const onClick = async() => {
        try {
            setIsLoading(true);

            await axios.put(`${process.env.NEXT_PUBLIC_APP_URL}/api/courses/${courseId}/chapters/${chapterId}/progress`,{
                isCompleted: !isCompleted
            });
            if(!isCompleted && !nextChapterId){
                confetti.onOpen();
            }
            if(!isCompleted && nextChapterId) {
                router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
            }

            toast.success("Progress updated");
            router.refresh();
        } catch  {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Button
            onClick={onClick}
            disabled={isLoading}
            className="w-full md:w-auto"
            type="button"
            variant={isCompleted ? "outline" : "success"}
        >
            {isCompleted ? "Not completed" : "Mark as complete"}
            <Icon className="h-4 w-4 ml-2"/>
        </Button>
        
    )
}