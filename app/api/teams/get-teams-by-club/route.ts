import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req:NextRequest)
{
    try 
    {
        const prisma = new PrismaClient()
        const {searchParams} = new URL(req.url)
        const clubId:string = searchParams.get("clubId") || ""
        const teams = await prisma.team.findMany({
            where:{
                clubId:clubId
            },
            include:{
                members:true,
                leaders:true,
                
            }
        })
        return NextResponse.json({message:"Success", teams}, {status:200})
    }
    catch(err)
    {
        console.log(`[ERROR] GET Teams By Club Endpoint: ${err}`)
        return NextResponse.json({message:"Internal Server Error!"}, {status:500})
    }
}