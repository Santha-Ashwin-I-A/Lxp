import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(
    req:Request,
    {params}:{params:{ courseId: string, attachmentId: string}}) {
    try {
        const course = await db.course.findUnique({
            where:{
                id:params.courseId,
            }
        })
        if (!course) {
            return new NextResponse("Not find course",{status:404})
        }
        const attachment = await db.attachment.delete({
            where:{
                id:params.attachmentId,
                courseId:params.courseId,
            }
        })
        return NextResponse.json(attachment);
    } catch (error) {
        console.log("ATTACHMENT_ID",error);
        return new NextResponse("Internal Error",{status:500})
    }
}