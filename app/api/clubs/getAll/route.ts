import { prisma } from "@/lib/prisma";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {

    const clubs = await prisma.club.findMany({
      include: {
        clubLeads: true,
      },
    });

    return NextResponse.json({ clubs }, { status: 200 });
  } catch (err) {
    console.error("[ERROR] All Club Fetching Endpoint: " + err);
    return NextResponse.json(
      { message: "Failed to fetch clubs" },
      { status: 500 }
    );
  }
}
