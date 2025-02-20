import { prisma } from "@/lib/prisma";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";


export const dynamic = 'force-dynamic'
export async function DELETE(req:NextRequest)
{
    try 
    {
       
        const body = await req.json();
        const teamId = body.teamId;
        await prisma.team.delete({
            where:{
                teamId:teamId
            }
        })
       
        return NextResponse.json({message:"Team Deleted"},{status:200})
    }
    catch(err)
    {
        console.error(err)
        return NextResponse.json({message:"Internal Server Error"},{status:500})
    }
}