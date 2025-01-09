import { prisma } from "@/lib/prisma";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    
    const {searchParams} = new URL(request.url);
    const employeeId = searchParams.get('employeeId');

    if (!employeeId)
    {
      // Fetch tasks assigned to the specified assignee
      const users = await prisma.user.findMany({
        select: {
          userId: true,
          employeeId: true,
          username: true,
          email: true
        },
        take: 5
      });

      return NextResponse.json({message:"Success!", users}, {status: 200});
    }
    else 
    {
      const user = await prisma.user.findUnique({
        where: {
          employeeId: employeeId
        },
        select: {
          userId: true,
          employeeId: true,
          username: true,
          email: true
        }
      });

      if (!user)
      {
        return NextResponse.json({message: "User not found"}, {status: 404});
      }

   
      return NextResponse.json({message:"Success!", user}, {status: 200});
    }
  } catch (err) {
    console.log("ERROR fetching users:", err);
    return NextResponse.json(
      { message: "Error fetching users" },
      { status: 500 }
    );
  }
}
