import { generateNotification } from "@/lib/notifications/serverFns";
import { prisma } from "@/lib/prisma";
import { NotificationType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req:NextRequest)
{
    try 
    {   
        const body = await req.json()
        await prisma.message.create({
            data:{
                content: body.content,
                senderId: body.senderId,
                receiverId: body.receiverId
            }
        })

        await generateNotification({
            message: body.content,
            actionUrl:"",
            receiverId: body.receiverId,
            title: "New Message",
            toKeep: false,
            senderId: body.senderId,
            type:"UPDATE"
        })

        return NextResponse.json({
            message:"Message created successfully"
        }, {status:200})
    }
    catch(err)
    {
        console.log("Error at message creation endpoint: ", err)
        return NextResponse.json({
            error: "Internal Server Error"
        },{status:500})
    }
}