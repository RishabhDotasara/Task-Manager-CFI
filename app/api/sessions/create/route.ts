import { PrismaClient, Session } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req:NextRequest)
{
    try 
    {
        const prisma = new PrismaClient();
        
    }
    catch(err)
    {
        console.log(`[Session Handler] Creation Endpoint : ${err}`)
        return NextResponse.json({message:"Error Creating Session."}, {status:500})
    }
}