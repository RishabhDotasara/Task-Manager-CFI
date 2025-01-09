import { prisma } from "@/lib/prisma";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req:NextRequest)
{
    try 
    {

        const {searchParams} = new URL(req.url)
        const clubId = searchParams.get("clubId")

        const club = await prisma.club.findUnique({
            where:{
                clubId:clubId || ""
            },
            include:{
                clubLeads:true
            }
        })


        return NextResponse.json({message:"Success", club}, {status:200})

    }
    catch(err)
    {
        console.error(`[ERROR] get Club By Id : ${err}`)
        return NextResponse.json({message:"Internal Server Error!"}, {status:500})
    }
}