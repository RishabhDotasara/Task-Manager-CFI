import { prisma } from "@/lib/prisma";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req:NextRequest)
{
    try 
    {
      
        const {searchParams} = new URL(req.url)
        const clubId:string = searchParams.get("clubId") || ""
        const page = parseInt(searchParams.get("page") || "1")
        const limit = parseInt(searchParams.get("limit") || "10")
        const teams = await prisma.team.findMany({
            where:{
                clubId:clubId
            },
            include:{
                members:true,
                leaders:true,
                
            },
            skip:(page-1)*limit,
            take:limit
        })
        return NextResponse.json({message:"Success", teams}, {status:200})
    }
    catch(err)
    {
        console.log(`[ERROR] GET Teams By Club Endpoint: ${err}`)
        return NextResponse.json({message:"Internal Server Error!"}, {status:500})
    }
}