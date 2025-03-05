import { db } from "@/lib/db";
import {  NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(req: Request) { 
        try{
            const user =await currentUser();
            const userId = user?.id;
            if(!userId){
                return new NextResponse("Unauthorized",{status:401});
            }
            const {title} = await req.json();
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
