import { db } from "@/lib/db";
import { NextResponse } from "next/server";

type tparams= Promise<{
    courseId:string
}>;

export async function PATCH(req:Request,
    {
        params 
    }:{
        params:tparams
    }
) {
    try {
        const {courseId} = await params;
        const values = await req.json();
        const course = await db.course.update({
            where:{
                id:courseId,
                userId:values.userId,
            },
            data:{
                ...values,
            }
        })

        return NextResponse.json(course);
    } catch (error) {
        console.log("[COURSE_ID_PUBLISH]",error);
        return new NextResponse("Internal error",{status:500})
    }
}