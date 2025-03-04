"use client";

import { Button } from "@/components/ui/button";
import { Swot } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

interface ActionsProps {
    swot:Swot;
    isComplete: boolean;
}

export const Actions =({
    swot,
    isComplete,
}:ActionsProps)=>{
    const router = useRouter();
    const [isloading,setIsloading] = useState(false);

    const onClick = async() =>{
       const swotData ={
               "strengths":swot?.strengths,
               "weaknesses":swot?.weaknesses,
               "opportunities":swot?.opportunities,
               "threats":swot?.threats,
       
           }
        try{
            const response = await axios.post(`${process.env.NEXT_PUBLIC_APP_URL}/api/swot`,swotData)
            const explanation = response.data.Explanation;
            const suggestedRole = response.data.SuggestedRole; 
            const swotUpdateData = {
                "explanation": explanation,
                "suggestedRole": suggestedRole,
                "isFinished":true
            }
            const swotUp = await axios.patch(`${process.env.NEXT_PUBLIC_APP_URL}/api/swot/${swot.id}`,swotUpdateData)
            if(!swotUp) {return null}
            router.push(`/swot-analysis/${swot.id}/result`)
        }catch {
            toast.error("Something went wrong");
        } finally {
            setIsloading(false);
        }
    };

    return(
        <div className="flex  items-center gap-x-2">
            <Button
                onClick={onClick}
                disabled={!isComplete || isloading}
                variant={"outline"}
                size={"sm"}
            >
                Start AI
            </Button>
        </div>
    )
}