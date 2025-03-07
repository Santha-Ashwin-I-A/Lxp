import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req:Request){
    const { userId } = await req.json();
    if(!userId){
        return new NextResponse("Unauthorized",{status:401});
    }
    const response = await db.sga.create({
        data:{
            userId:userId,
        }
    })
    return NextResponse.json(response);
}