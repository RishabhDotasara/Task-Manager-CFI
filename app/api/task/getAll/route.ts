import { prisma } from "@/lib/prisma";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const assigneeId = searchParams.get("assigneeId");
  const teamId = searchParams.get("teamId");

  try {
    
    let tasks:any = [];
    // Fetch tasks assigned to the specified assignee

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

 
    return NextResponse.json(tasks, { status: 200 });
  } catch (err) {
    console.log("ERROR fetching tasks:", err);
    return NextResponse.json({ message: "Error fetching tasks" }, { status: 500 });
  }
}
