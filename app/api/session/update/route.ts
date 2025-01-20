import { prisma } from "@/lib/prisma";
import { User } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic"

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId");
    if (!sessionId) {
      return NextResponse.json(
        { message: "Session Id is required!" },
        { status: 400 }
      );
    }

    const session = await prisma.session.update({
      where: {
        sessionId: sessionId || "",
      },
      data: {
        date: body.date,
        description: body.description,
        endTime: body.endTime,
        eventType: body.eventType,
        startTime: body.startTime,
        title: body.title,
        location: body.location,
        teamId: body.teamId,
      },
      include: {
        team: {
          include: {
            members: true,
          },
        },
      },
    });

    session.team.members.map(async (user: User) => {
      await prisma.notification.create({
        data: {
          message: "Event Updated: " + session.title,
          actionUrl: "/session-scheduler",
          title: "New Event",
          type: "EVENT",
          senderId: body.creatorId,
          receiverId: user.userId,
          toKeep: true,
          timestamp: new Date(),
        },
      });
    });

    return NextResponse.json(
      { message: "Session Updated Successfully!" },
      { status: 200 }
    );
  } catch (err) {
    console.error(`[ERROR] Session Updation Endpoint: ${err}`);
    return NextResponse.json(
      { message: "Internal Server Error!" },
      { status: 500 }
    );
  }
}

