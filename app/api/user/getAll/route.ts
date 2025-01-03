import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const prisma = new PrismaClient();

    // Fetch tasks assigned to the specified assignee
    const users = await prisma.user.findMany({
      select: {
        userId: true,
        employeeId: true,
        username:true,
        email:true
      },
    });

    await prisma.$disconnect();

    return NextResponse.json({users}, { status: 200 });
  } catch (err) {
    console.log("ERROR fetching users:", err);
    return NextResponse.json(
      { message: "Error fetching users" },
      { status: 500 }
    );
  }
}
