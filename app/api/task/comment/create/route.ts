import { generateNotification } from "@/lib/notifications/serverFns";
import { prisma } from "@/lib/prisma";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic"


export async function POST(request: NextRequest) {
  try {
  
    const body = await request.json();
    const comment = await prisma.comment.create({
      data: {
        authorId: body.authorId,
        content: body.content,
        taskId: body.taskId,
      },
      include: {
        author: true,
        task:true
      },
    });

    await generateNotification({
        title: "New Comment",
        message: `You have a new comment on task "${comment.task.title}"`,
        actionUrl:"/task-manager/task/"+comment.taskId,
        toKeep: false,
        type: "COMMENT",
        senderId:comment.authorId,
        receiverId: comment.authorId === comment.task.createdById ? comment.task.assigneeId : comment.task.createdById
    })


    return NextResponse.json(
      { message: "Comment created successfully!", comment },
      { status: 200 }
    );
  } catch (err) {
    console.log(`ERROR while commenting.`, err);
    return NextResponse.json({ message: "Error on server" }, { status: 500 });
  }
}
