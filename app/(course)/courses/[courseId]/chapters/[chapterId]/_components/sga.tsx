"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

interface SGAProps {
    isCompleted?: boolean;
}

export const SGA =({
    isCompleted,
}:SGAProps)=>{
    const router = useRouter();
    const [isLoading,setIsLoading] = useState(false);

    const onClick = async() => {
        try {
            setIsLoading(true);
            if(isCompleted = true){
             router.push(`/skill-gap-analysis`);
            }
        } catch  {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Button
            onClick={onClick}
            disabled={isLoading || !isCompleted}
            className="w-full md:w-auto"
            type="button"
            variant={ "success"}
        >
            Go to Skill Gap Analysis
        </Button>
        
    )
}