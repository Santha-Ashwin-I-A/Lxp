import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req:Request){
    try{
    const value = await req.json();
    if(!value.userId){
        return new NextResponse("Unauthorized",{status:401});
    }

    const response = await db.swot.create({
        data:{
            userId:value.userId,
            }
    })
    return NextResponse.json(response);
    }catch (error) {
        console.log("[courses]",error);
        return new NextResponse("Internal Error",{status:500});
    }
}