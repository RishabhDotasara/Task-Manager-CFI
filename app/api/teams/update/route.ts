import { generateNotification } from "@/lib/notifications/serverFns";
import { prisma } from "@/lib/prisma";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
/**
 * Handles the POST request to update a team.
 *
 * @param {NextRequest} request - The incoming request object.
 * @returns {Promise<NextResponse>} - The response object with a success or error message.
 *
 * @throws {Error} - If there is an error updating the team.
 *
 * The request body should contain the following properties:
 * - teamId: The ID of the team to be updated.
 * - teamName: The new name of the team.
 * - members: An array of user IDs to be set as members of the team.
 * - leaders: An array of user IDs to be set as leaders of the team.
 * - newMembers: An array of user IDs who are newly added to the team.
 * - newLeaders: An array of user IDs who are newly added as leaders of the team.
 * - promoterId: The user ID of the person promoting the changes.
 *
 * The function performs the following actions:
 * 1. Parses the request body.
 * 2. Updates the team with the specified teamId, setting the new name, members, and leaders.
 * 3. Generates notifications for new members and new leaders.
 * 4. Returns a success response if the update is successful.
 * 5. Returns an error response if there is an error during the update process.
 */

export async function POST(request: NextRequest) {
  try {
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
      generateNotification({
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
      generateNotification({
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
