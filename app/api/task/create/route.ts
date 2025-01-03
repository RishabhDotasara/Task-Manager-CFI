import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const getTask = (id:string, body:any)=>{
  return {
      title: body.title,
      description: body.description,
      createdById: body.createdById, // Ensure this matches the name used in the body
      assigneeId: id,
      deadline: body.deadline,
      status: "PENDING", // Assuming you have a status field
      teamId: body.teamId,
  }
}

export async function POST(request: NextRequest) {
  try {
    const prisma = new PrismaClient();
    const body = await request.json();
    const dataToCreateTasks = body.assigneeIds.map((id:string)=>getTask(id, body))

    const task = await prisma.task.createMany({
      data:dataToCreateTasks,
    });

    return NextResponse.json({ message: "Task created and assigned!", task }, { status: 200 });
  } catch (err) {
    console.error("Error in task creation:", err);
    return NextResponse.json({ message: "Error creating task" }, { status: 500 });
  }
}
