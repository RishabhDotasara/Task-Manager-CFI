import { prisma } from "@/lib/prisma";
import { permissions } from "@/permissionManager/permissions";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';


export async function GET(req:NextRequest)
{
    try 
    {
        
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