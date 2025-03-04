import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(req:Request,
    {
        params 
    }:{
        params:{courseId:string;chapterId:string}
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

        const unpublish = await db.chapter.update({
            where:{
                id:chapterId,
                courseId:courseId
            },
            data:{
                isPublished:false
            }
        })
        const publishedChaptersInCourse = await db.chapter.findMany({
            where:{
                courseId: courseId,
                isPublished:true,
            }
        });
        if(!publishedChaptersInCourse.length){
            await db.course.update({
                where:{
                    id:courseId
                },
                data:{
                    isPublished:false,
                }
            })
        }

        return NextResponse.json({unpublish});
    } catch (error) {
        console.log("[CHAPTER_UNPUBLISH]",error);
        return new NextResponse("Internal error",{status:500})
    }
}