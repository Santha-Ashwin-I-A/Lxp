"use client";

import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { useSession } from "@clerk/nextjs";
import axios from "axios";
import { Loader } from "lucide-react";
import { redirect, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

const SwotAnalysisPage = () => {
    const [isLoading,setIsLoading] = useState(false);
    const router = useRouter();
    const user = useSession();
    const userId = user.session?.id;
    if(!userId){return redirect("/sign-in")}
    const onSubmit = async() =>{
        try {
            setIsLoading(true);
            const values = {
                "userId":userId,
            }
            const response = await axios.post(`${process.env.NEXT_PUBLIC_APP_URL}/api/swot/create`,values);
            router.push(`/swot-analysis/${response.data.id}`);
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
                SWOT Analysis Overview
            </div>
            <div>
                SWOT analysis is a strategic planning tool that helps identify internal and external factors that affect an organization or project. The acronym SWOT stands for Strengths, Weaknesses, Opportunities, and Threats.
            </div>
            <div>
                what we do with SWOT?
                    We use swot analysis to specify a certain job role that may suitable for you. You can also choose the course you desire
                    The SWOT Analysis is done by a popular AI COHERE
            </div>
            <Button
                onClick={onSubmit}
                className=""
                variant={"success"}
            >
                Start
            </Button>
        </div>
     );
}
 
export default SwotAnalysisPage;