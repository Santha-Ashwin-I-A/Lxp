import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { StrengthForm } from "./_components/strength-form";
import { ThreatForm } from "./_components/threats-form";
import { Opportunities } from "./_components/opportunities-form";
import { WeaknessForm } from "./_components/weakness-form";
import { Actions } from "./_components/action";

type tparams= Promise<{
    swotId:string
}>;

const SwotFormPage = async({params}:{params: tparams}) => {
    const {swotId} = await params;
    const user = auth();
    const userId = (await user).userId
    if(!userId){return redirect("/")}
    const swot = await db.swot.findUnique({
        where:{
            userId,
            id:swotId
        }
    }) 
    const requiredFields = [
        swot?.strengths,
        swot?.weaknesses,
        swot?.opportunities,
        swot?.threats,
    ]
    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;

    const completionText = `(${completedFields}/${totalFields})`

    const isComplete = requiredFields.every(Boolean);

    return ( 
        <div>
            <div className="flex flex-col gap-y-2">
                        <h1 className="text-2xl font-medium">
                            SWOT Analysis Form
                        </h1>
                        <span className="text-sm text-slate-700">
                            Complete all fields {completionText} 
                        </span>
            </div>
            <div>
                <div>
                    <StrengthForm 
                        swot={swot!}
                    />
                    <WeaknessForm
                        swot={swot!}
                    />
                </div>
                <div className="space-y-6">
                    <Opportunities 
                        swot={swot!}
                    />
                    <ThreatForm
                        swot={swot!}
                    />
                </div>
            </div>
            <div>
                <Actions
                    swot={swot!}
                    isComplete={isComplete}
                />
            </div>
        </div>
     );
}
 
export default SwotFormPage;