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
            include:{
                Chapters:{
                    include:{
                        muxData:true,
                    }
                }
            }
        })
        if(!course) console.log("Cannot find course")
        const hasPublishedChapter = course?.Chapters.some((chapter)=>chapter.isPublished);

        if(!course?.title || !course?.description || ! course?.imageUrl || !course.categoryId || !course.price || !hasPublishedChapter){
            return new NextResponse("Missing required fields",{status:400});
        }
        const publish = await db.course.update({
            where:{
                id:courseId,
            },
            data:{
                isPublished:true,
            }
        })

        return NextResponse.json(publish);
    } catch (error) {
        console.log("[COURSE_ID_PUBLISH]",error);
        return new NextResponse("Internal error",{status:500})
    }
}