import { db } from "@/lib/db";
import { NextResponse } from "next/server";

type tparams= Promise<{
    swotId:string;
}>;

export async function PATCH(req:Request,{params}:{params :tparams}) {
    try {
        const values = await req.json();
        const {swotId} = await params;
        const swot = await db.swot.update({
            where:{
                id:swotId,
                userId:values.userId,
            },
            data:{
                ...values
            }
        })
        return NextResponse.json(swot);
    } catch (error) {
        console.log("Error on swot",error)
        return NextResponse.json("Internal server error");
    }
}