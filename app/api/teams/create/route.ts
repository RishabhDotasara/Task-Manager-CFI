import { prisma } from "@/lib/prisma";
import { PrismaClient, User } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export async function POST(request: NextRequest) {
  try {
    
    const body = await request.json();

    const team = await prisma.team.create({
      data: {
        name: body.name,
        clubId: body.clubId,
      },
    });
  
    return NextResponse.json({ message: "Team Created" }, { status: 200 });
  } catch (err) {
    console.error(`[ERROR] Team Creation Endpoint: ${err}`)
    return NextResponse.json(
      { message: "Error Creating Team" },
      { status: 500 }
    );
  }
}
