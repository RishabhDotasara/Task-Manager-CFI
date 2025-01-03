import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request:NextRequest)
{
    try 
    {
        const prisma = new PrismaClient();
        const body = await request.json();

        await prisma.task.update({
            where:{
                taskId:body.taskId
            },
            data:{
                status:body.status
            }
        })
        return NextResponse.json({message:"Status updated!"}, {status:200})
        
    }
    catch(err)
    {
        console.log(`ERROR`,err);
        return NextResponse.json({message:"Error on server!"}, {status:500})
    }
}