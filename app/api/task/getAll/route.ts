import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const assigneeId = searchParams.get("assigneeId");
  const teamId = searchParams.get("teamId");

  try {
    const prisma = new PrismaClient();
    let tasks:any = [];
    // Fetch tasks assigned to the specified assignee
    console.log("assigneeId", assigneeId);
    console.log("teamId", teamId);
    if (assigneeId)
    {
       tasks = await prisma.task.findMany({
        where: {
          assigneeId: assigneeId,
          teamId: teamId,
        },
        include: {
          user: true, 
          assignee: true, 
        },
      });
    }
    else 
    {
      tasks = await prisma.task.findMany({
        where:{
          teamId: teamId,
        },
        include: {
          user: true, 
          assignee: true, 
        },
      });
    }

    await prisma.$disconnect();

    return NextResponse.json(tasks, { status: 200 });
  } catch (err) {
    console.log("ERROR fetching tasks:", err);
    return NextResponse.json({ message: "Error fetching tasks" }, { status: 500 });
  }
}
