import { db } from "@/lib/db";
import { NextResponse } from "next/server";

type tparams= Promise<{
    courseId:string;
}>;

export async function POST(
    req:Request,
    {params}:{params:tparams}
) {
    try {
        const values = await req.json();
        const { courseId} = await params
        const courseOwner = await db.course.findUnique({
            where:{
                id:courseId,
                userId:values.userId,
            }
        })
        if (!courseOwner) {
            return new NextResponse("Unauthorized",{status:401})
        }

        const lastChapter = await db.chapter.findFirst({
            where:{
                courseId: courseId,
            },
            orderBy:{
                position:"desc",
            },
        });

        const newPosition = lastChapter ? lastChapter.position + 1 : 1;

        const chapter = await db.chapter.create({
            data:{
                title: values.title,
                courseId: courseId,
                position: newPosition,
            }
        });

        return NextResponse.json(chapter);

    } catch (error) {
        console.log("[CHAPTERS]",error);
        return new NextResponse("Internal Error",{status:500})
    }
}