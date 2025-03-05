import { db } from "@/lib/db";
import { NextResponse } from "next/server";

type tparams= Promise<{
    courseId:string;
}>;

export async function PUT(
    req:Request,
    {params}:{params:tparams}
) {
    try {
        const {userId,list} = await req.json();
        const {courseId} = await params;
        const courseOwner = await db.course.findUnique({
            where:{
                id:courseId,
                userId:userId,
            }
        })
        if (!courseOwner) {
            return new NextResponse("Unauthorized",{status:401})
        }

        for(const item of list){
            await db.chapter.update({
                where:{
                    id: item.id,
                },
                data:{
                    position: item.position
                }
            })
        }

        return new  NextResponse("success",{status:200});

    } catch (error) {
        console.log("[REORDER]",error);
        return new NextResponse("Internal Error",{status:500})
    }
}