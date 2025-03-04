import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(req:Request,
    {
        params 
    }:{
        params:{courseId:string;}
    }
) {
    try {
        const {courseId} = await params;
        const course = await db.course.findUnique({
            where:{
                id:courseId
            },
        })
        if(!course) console.log("Cannot find course")
        const unpublish = await db.chapter.update({
            where:{
                id:courseId
            },
            data:{
                isPublished:false
            }
        })

        return NextResponse.json(unpublish);
    } catch (error) {
        console.log("[COURSE_ID_PUBLISH]",error);
        return new NextResponse("Internal error",{status:500})
    }
}