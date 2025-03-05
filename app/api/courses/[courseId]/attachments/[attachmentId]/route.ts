import { db } from "@/lib/db";
import { NextResponse } from "next/server";

type tparams= Promise<{
    courseId:string;
    attachmentId:string;
}>;

export async function DELETE(
    req:Request,
    {params}:{params:tparams}) {
    try {
        const {courseId,attachmentId} = await params;
        const course = await db.course.findUnique({
            where:{
                id:courseId,
            }
        })
        if (!course) {
            return new NextResponse("Not find course",{status:404})
        }
        const attachment = await db.attachment.delete({
            where:{
                id:attachmentId,
                courseId:courseId,
            }
        })
        return NextResponse.json(attachment);
    } catch (error) {
        console.log("ATTACHMENT_ID",error);
        return new NextResponse("Internal Error",{status:500})
    }
}