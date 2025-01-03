import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(request: Request)
{
    try 
    {
        const prisma = new PrismaClient();
        const url = new URL(request.url);
        const userId = url.searchParams.get("userId");

        // Fetch tasks assigned to the specified assignee
        const user = await prisma.user.findUnique({
            where:{
                userId:userId as string
            },
            select: {
                userId: true,
                employeeId: true,
                permissions:true, 
                teams:true,
                teamLeader:true
            },
        });

        // console.log(user)

        await prisma.$disconnect();

        return NextResponse.json({user}, { status: 200 });
    }
    catch(err)
    {
        console.log("ERROR fetching users:", err);
        return NextResponse.json(
        { message: "Error fetching users" },
        { status: 500 }
        );
    }
}