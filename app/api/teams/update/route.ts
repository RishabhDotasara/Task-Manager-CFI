import { generateNotification } from "@/lib/notifications/serverFns";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export async function POST(request: NextRequest) {
  try {
    const prisma = new PrismaClient();
    const body = await request.json();

    // Update the team with the specified teamId
    console.log(body);
    const team = await prisma.team.update({
      where: {
        teamId: body.teamId,
      },
      data: {
        name: body.teamName,
        members: {
          set: body.members.map((memberId: string) => {
            return { userId: memberId };
          }),
        },
        leaders: {
          set: body.leaders.map((leaderId: string) => {
            return { userId: leaderId };
          }),
        },
      },
    });

    const {
      newMembers,
      newLeaders,
      promoterId,
    }: { newMembers: string[]; newLeaders: string[]; promoterId: string } =
      body;
    newMembers.map(async (memberId: string) => {
      await generateNotification({
        title: "New Team",
        message: `You are now a part of the team "${team.name}"`,
        actionUrl: "",
        receiverId: memberId,
        senderId: promoterId,
        toKeep: false,
        type: "TEAM",
      });
    });

    newLeaders.map(async (leaderId: string) => {
      await generateNotification({
        title: "Team Leader",
        message: `You are now a Leader of the team "${team.name}"`,
        actionUrl: "",
        receiverId: leaderId,
        senderId: promoterId,
        toKeep: false,
        type: "TEAM",
      });
    });

    return NextResponse.json({ message: "Team updated" }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Error updating team" },
      { status: 500 }
    );
  }
}
