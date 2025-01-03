import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request:NextRequest)
{
    try 
    {   
        const prisma = new PrismaClient();
        const body = await request.json();
        await prisma.task.delete({
            where:{
                taskId:body.taskId
            }
        })
        prisma.$disconnect()
        return NextResponse.json({message:"Deleted the task!"}, {status:200})

    }
    catch(err)
    {
        console.log("Error in deleting task", err);
        return NextResponse.json({message:"Error on server!"}, {status:500})
    }
}