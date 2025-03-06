import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

type tparams= Promise<{
    swotId:string;
}>

const SelectCoursePage = async({params}:{params:tparams}) => {
    const user =await currentUser();
    const userId = user?.id;
    const {swotId} = await params;
    if(!userId || userId == undefined){
        return redirect("/");
    }
    const swotDetails = await db.swot.findUnique({
        where:{
            id:swotId,
            userId:userId,
            isFinished:true
        }
    })
    const categories = await db.category.findMany();
    if(!swotDetails){
        alert("You are yet complete swot!! complete it first before course selection");
        return redirect("/swot-analysis");
    }
    const suggestedRole = swotDetails.suggestedRole;
    const suggestedCategory = categories.find(name=>suggestedRole);
    const Courses = await db.course.findMany({
        orderBy:{
            title:"asc"
        }
    })

    return ( 
        <>
            <div>
                Select Course page
            </div>
        </> 
     );
}
 
export default SelectCoursePage;