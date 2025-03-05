import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

type tparams= Promise<{
    courseId:string;
    chapterId:string;
}>;

export async function PUT(req:Request,
    {
        params 
    }:{
        params:tparams
    }
) {
    try {
        const {chapterId} = await params;
        const {isCompleted} = await req.json();
        const user = auth();
        const userId = (await user).userId;
        if(!userId){
            return new NextResponse("Unauthorized",{status:401})
        }

        const userProgress = await db.userProgress.upsert({
            where:{
                userId_chapterId:{
                    userId,
                    chapterId:chapterId
                }
            },
            update:{
                isCompleted
            },
            create:{
                userId,
                chapterId:chapterId,
                isCompleted,
            }
        })
        return NextResponse.json(userProgress);

    } catch (error) {
        console.log("[CHAPTER_ID_PROGRESS]",error);
        return new NextResponse("internal error",{status:500})
    }
}