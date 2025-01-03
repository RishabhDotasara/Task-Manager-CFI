import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request:NextRequest)
{
    try 
    {

        const prisma = new PrismaClient();
        const body = await request.json();
        const comment = await prisma.comment.create({
            data:{
                authorId:body.authorId,
                content:body.content,
                taskId:body.taskId,
            },
            include:{
                author:true
            }
        })

        prisma.$disconnect();

        return NextResponse.json({message:"Comment created successfully!", comment}, {status:200})
    }
    catch(err)
    {
        console.log(`ERROR while commenting.`, err);
        return NextResponse.json({message:"Error on server"}, {status:500})
    }
}