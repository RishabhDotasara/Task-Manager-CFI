import { generateNotification } from "@/lib/notifications/serverFns";
import { prisma } from "@/lib/prisma";
import { PrismaClient, Status, Task } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

interface ReturnTask {
  title:string,
  description:string,
  createdById:string,
  assigneeId: string,
  deadline: string,
  status: Status,
  teamId: string
}

const getTask = (id:string, body:any) : ReturnTask=>{
  return {
      title: body.title,
      description: body.description,
      createdById: body.createdById, 
      assigneeId: id,
      deadline: body.deadline,
      status: Status.PENDING,
      teamId: body.teamId,
  }
}

export async function POST(request: NextRequest) {
  try {

    const body = await request.json();
    const dataToCreateTasks = body.assigneeIds.map((id:string)=>getTask(id, body))

    const task = await prisma.task.createMany({
      data:dataToCreateTasks,
    });

    dataToCreateTasks.map(async (task:Task)=>{
      await generateNotification({
        title:`New Task`,
        message: `New Task Assigned: "${task.title}"`,
        actionUrl: "",
        receiverId: task.assigneeId,
        senderId: task.createdById,
        toKeep: true,
        type: "TASK"
      })
    })

    return NextResponse.json({ message: "Task created and assigned!", task }, { status: 200 });
  } catch (err) {
    console.error("Error in task creation:", err);
    return NextResponse.json({ message: "Error creating task" }, { status: 500 });
  }
}
