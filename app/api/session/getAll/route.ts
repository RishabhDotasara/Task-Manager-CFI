import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest)
{
    try 
    {
        const {searchParams} = new URL(req.url)
        const teamId = searchParams.get("teamId")
        const sessions = await prisma.session.findMany({
            where:{
                teamId:teamId || ""
            }
        })
        return NextResponse.json({sessions, message:"Success!"}, {status:200})
    }
    catch(err)
    {
        console.error(`[ERROR] Get All Sessions Endpoint: ${err}`)
        return NextResponse.json({message:'Internal Server Error'}, {status:500})
    }
}