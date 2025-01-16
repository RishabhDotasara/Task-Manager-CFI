import { prisma } from "@/lib/prisma";
import { User } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  try {
    const { sessionId, creatorId } = await req.json();
    if (!sessionId) {
      return NextResponse.json(
        { message: "Invalid Request, SessionId missing!" },
        { status: 400 }
      );
    }
    // Delete the session with the given sessionId
    const session = await prisma.session.delete({
      where: { sessionId },
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
          message: "Event Cancelled : " + session.title,
          actionUrl: "/session-scheduler",
          title: "New Event",
          type: "EVENT",
          senderId: creatorId,
          receiverId: user.userId,
          toKeep: true,
          timestamp: new Date(),
        },
      });
    });
    return NextResponse.json({ message: "Session Deleted" }, { status: 200 });
  } catch (err) {
    console.log(`[ERROR] Session Deletion Endpoint: ${err}`);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
