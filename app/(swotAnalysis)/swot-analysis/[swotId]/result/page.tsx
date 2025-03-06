import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

type tparams= Promise<{
    swotId:string
}>;

const SwotResultPage = async({params}:{params:tparams}) => {
    const {swotId} = await params;
    const swot = await db.swot.findUnique({
        where:{
            id:swotId,
            isFinished:true,
        }
    })

    return ( 
        <div>
            <div className="text-green-950 text-3xl">
                Result of SWOT Analysis
            </div>
            <div>
                <div className="text-slate-900 text-2xl">Explanation</div>
                <div>
                    {swot?.explanation}
                </div>
                <div className="text-slate-900 text-2xl">
                    Suggestions of Roles
                </div>
                <div>
                    {swot?.suggestedRole}
                </div>
            </div>
            <Link href={"/selectCourse"}>
                <Button>
                    Click here to choose courses correspond to suggestedRole
                    <ArrowRight className="h-4 w-4 text-sky-800"/>
                </Button>
            </Link>
        </div>
     );
}
 
export default SwotResultPage;