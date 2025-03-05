import { db } from "@/lib/db";
import { NextResponse } from "next/server";

type tparams= Promise<{
    courseId:string;
    chapterId:string;
}>;

export async function PATCH(req:Request,
    {
        params 
    }:{
        params:tparams
    }
) {
    try {
        const {courseId,chapterId} = await params;
        const course = await db.course.findUnique({
            where:{
                id:courseId
            }
        })
        if(!course) console.log("Cannot find course")
        const chapter = await db.chapter.findUnique({
            where:{
                id: chapterId,
                courseId: courseId,
            }
        });

        const muxData = await db.muxData.findUnique({
            where:{
                chapterId:chapterId,
            }
        })

        if(!chapter || !muxData || ! chapter.title || !chapter.description || ! chapter.videoUrl){
            return new NextResponse("Missing required fields",{status:400});
        }
        const publish = await db.chapter.update({
            where:{
                id:chapterId,
                courseId:courseId
            },
            data:{
                isPublished:true
            }
        })

        return NextResponse.json(publish);
    } catch (error) {
        console.log("[COURSE_ID]",error);
        return new NextResponse("Internal error",{status:500})
    }
}