import { prisma } from "@/lib/prisma";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req:NextRequest)
{
    try 
    {
    
        const {searchParams} = new URL(req.url)
        const userId = searchParams.get("userId")
        const notifications = await prisma.notification.findMany({
            where:{
                receiverId:userId || "",
                read:false
            },
            include:{
                sender:true,
                receiver:true
            },
            orderBy:{
                timestamp:"desc"
            }
        })
        return NextResponse.json({message:"Fetched SuccesFully!", notifications})
    }
    catch(err)
    {
        console.error(`[ERROR] Notification Fetch Point: ${err}`)
        return NextResponse.json({message:"Internal Server Error!"}, {status:500})
    }
}