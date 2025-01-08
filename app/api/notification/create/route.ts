import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req:NextRequest)
{
    try 
    {
        const prisma = new PrismaClient();
        const body = await req.json()
    }   
    catch(err)
    {
        console.error(`[ERROR] Notification Creation Endpoint: ${err}`)
        return NextResponse.json({message:"Internal Server Error!"}, {status:500})
    }


}
