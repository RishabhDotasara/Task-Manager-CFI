import { permissions } from "@/permissionManager/permissions";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";



export async function GET(req:NextRequest)
{
    try 
    {
        const prisma = new PrismaClient()
        const admins = await prisma.user.findMany({
            where:{
                permissions:{
                    has:permissions.admin.admin
                }
            }
        })

        return NextResponse.json({message:"Admins Fetched!", admins},{status:200})
    }
    catch(err)
    {
        console.error(`[ERROR] Get Admins Endpoint: ${err}`)
        return NextResponse.json({message:"Internal Server Error!"}, {status:500})
    }
}