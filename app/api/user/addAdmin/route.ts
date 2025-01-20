import { prisma } from "@/lib/prisma";
import { permissions } from "@/permissionManager/permissions";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic"

export async function POST(req:NextRequest)
{
    try 
    {
       
        const {userId} = await req.json()

        await prisma.user.update({
            where:{
                userId:userId
            },
            data:{
                permissions:{
                    push:permissions.admin.admin
                }
            }
        })

        return NextResponse.json({message:"Admin Added!"},{status:200})
    }
    catch(err)
    {
        console.error(`[ERROR] Add Admin Endpoint: ${err}`)
        return NextResponse.json({message:"Internal Server Error!"}, {status:500})
    }
}