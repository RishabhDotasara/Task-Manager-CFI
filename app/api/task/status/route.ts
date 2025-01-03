import { generateNotification } from "@/lib/notifications/serverFns";
import { PrismaClient, Status } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request:NextRequest)
{
    try 
    {
        const prisma = new PrismaClient();
        const body = await request.json();

        const task = await prisma.task.update({
            where:{
                taskId:body.taskId
            },
            data:{
                status:body.status
            }
        })
        console.log(body.status)
        if(body.status == Status.COMPLETED)
        {
            await generateNotification({
                title: "Task Completed",
                message: `Task "${task.title}" has been completed.`,
                actionUrl:"",
                receiverId: task.createdById,
                senderId: task.assigneeId,
                toKeep: false,
                type: "UPDATE"
            })
        }
        return NextResponse.json({message:"Status updated!"}, {status:200})
        
    }
    catch(err)
    {
        console.log(`ERROR`,err);
        return NextResponse.json({message:"Error on server!"}, {status:500})
    }
}