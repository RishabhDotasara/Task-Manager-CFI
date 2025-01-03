import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const prisma = new PrismaClient();
    const clubs = await prisma.club.findMany();
    await prisma.$disconnect();
    return NextResponse.json({ clubs }, { status: 200 });
  } catch (err) {
    console.error("[ERROR] All Club Fetching Endpoint: " + err);
    return NextResponse.json(
      { message: "Failed to fetch clubs" },
      { status: 500 }
    );
  }
}
