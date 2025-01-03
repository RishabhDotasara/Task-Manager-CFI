import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const prisma = new PrismaClient();
    const { searchParams } = new URL(request.url);
    const teamId = searchParams.get("teamId");

    // Fetch tasks assigned to the specified assignee
    if (!teamId) {
      return NextResponse.json({ message: "TeamId Missing" }, { status: 500 });
    }

    console.log(teamId);

    const team = await prisma.team.findUnique({
      where: {
        teamId: teamId || "",
      },

      select: {
        members: true,
      },
    });
    console.log(team);

    const users = team?.members;

    return NextResponse.json({ message: "Successfully got the users!", users });
  } catch (err) {
    console.log("Error:", err);
    return NextResponse.json({ message: "error on server." }, { status: 500 });
  }
}
