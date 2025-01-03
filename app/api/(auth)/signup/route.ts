
import { PrismaClient, User } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs"

export async function POST(request:NextRequest)
{
    try 
    {
        const prisma = new PrismaClient();
        const body = await request.json();

        const employeeId =  body.employeeId.toLowerCase()
        const hashedPassword = await bcrypt.hash(body.password, 10)

        const user = await prisma.user.create({
            data:{
                employeeId:employeeId,
                password:hashedPassword,
                username:body.username,
                email:body.email,
                permissions: body.permissions
            }
        })

        prisma.$disconnect()
        return NextResponse.json({message:"User Creation Successfull"}, {status:200})

    }
    catch(err)
    {
        
        console.log(`ERROR: ${err}`);
        return NextResponse.json({message:"Server Error"}, {status:500})
    }
}