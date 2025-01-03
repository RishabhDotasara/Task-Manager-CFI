import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';


export async function GET(request: NextRequest) {
  const prisma = new PrismaClient();

  try {
    // Extract taskId from the query params
    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get("taskId");

    console.log("Task Id:", taskId)

    // If taskId is not provided, return a 400 error
    if (!taskId) {
      return NextResponse.json({ message: "Task ID is required" }, { status: 400 });
    }

    // Fetch the specific task
    const task = await prisma.task.findUnique({
      where: {
        taskId,
      },
      include: {
        user: true, // Include the user who created the task
        assignee: true, // Include the user who is assigned to the task
        comments: {
          include:{
            author:true
          }
        }, // Include task comments if needed
      },
    });

    // If the task is not found, return a 404 error
    if (!task) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }

    // Return the fetched task
    return NextResponse.json(task, { status: 200 });
  } catch (err) {
    console.error("ERROR fetching task:", err);
    return NextResponse.json({ message: "Error fetching task" }, { status: 500 });
  } finally {
    // Ensure Prisma is properly disconnected
    await prisma.$disconnect();
  }
}
