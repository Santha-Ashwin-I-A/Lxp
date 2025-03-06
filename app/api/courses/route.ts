import { db } from "@/lib/db";
import {  NextResponse } from "next/server";

export async function POST(req: Request) { 
        try{
            const {title,userId} = await req.json();
            const course = await db.course.create({
                data:{
                    title:title,
                    userId:userId
                }
            })
            return NextResponse.json(course);
        } catch (error) {
        console.log("[courses]",error);
        return new NextResponse("Internal Error",{status:500});
    }
}
