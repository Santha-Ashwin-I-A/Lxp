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
        const {courseId} = await params;
        const courseOwner = await db.course.findUnique({
            where:{
                id:courseId,
                userId:values.userId,
            }
        })
        if (!courseOwner) {
            return new NextResponse("Unauthorized",{status:401})
        }
        const attachment = await db.attachment.create({
            data:{
                url:values.url,
                name:values.url.split("/").pop(),
                courseId: courseId,

            }
        });

        return NextResponse.json(attachment);

    } catch (error) {
        console.log("COURSE_ID_ATTACHMENTS",error);
        return new NextResponse("Internal Error",{status:500})
    }
}