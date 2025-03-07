"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { Loader } from "lucide-react";
import { redirect, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

const SGAPage = () => {
    const [isLoading,setIsLoading] = useState(false);
    const router = useRouter();
    const {userId} = useAuth();
    if(!userId){return redirect("/")}
    const onSubmit = async() =>{
        try {
            setIsLoading(true);
            const values = {
                "userId":userId,
            }
            const response = await axios.post(`${process.env.NEXT_PUBLIC_APP_URL}/api/sga/create`,values);
            router.push(`/sga/${response.data.id}`);
        } catch {
            toast.error("Something went wrong!! Try again!!")
        } finally{
            setIsLoading(false)
        }
    }
    return ( 
        <div className="p-6">
            {isLoading && (
                <div className="absolute h-full w-full bg-slate-500/20 top-0 right-0 rounded-md flex items-center justify-center ">
                    <Loader className="animate-spin h-6 w-6 text-sky-700"/>
                </div>
            )}
            <div>
                SGA Analysis Overview
            </div>
            <div>
                SGA analysis is a strategic planning tool that helps identify the learner have knowledge on .
            </div>
            <div>
                what we do in SGA?
                    We use SGA analysis to question user and calculate users knowledge that he/she have that industry wants.
                    The SGA Analysis is done by a popular AI COHERE
            </div>
            <Button
                onClick={onSubmit}
                className=""
                variant={"success"}
            >
                Start Test
            </Button>
        </div>
     );
}
 
export default SGAPage;