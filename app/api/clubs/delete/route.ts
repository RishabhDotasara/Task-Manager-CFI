import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic"


export async function DELETE(req:NextRequest)
{
    try 
    {
        const body = await req.json()
        console.log(body)
        await prisma.club.delete({
            where:{
                clubId:body.clubId
            }
        })
        return NextResponse.json({message:"Success!"}, {status:200})
    }
    catch(err)
    {
        console.log(`[ERROR] Club Deletion Endpoint: ${err}`)
        return NextResponse.json({message:"Internal Server Error!"}, {status:500})
    }
}