import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const prisma = new PrismaClient();
    const body = await req.json();

    const club = await prisma.club.create({
      data: {
        clubName: body.name,
        clubLeads:{
          connect:{
            userId:body.userId
          }
        }
      },
    });
    await prisma.$disconnect();
    return NextResponse.json({ message: "Club Created" }, { status: 200 });
  } catch (err) {
    console.error(`[ERROR] Club Creation Endpoint: ${err}`);
    return NextResponse.json(
      { message: "Error Creating Club" },
      { status: 500 }
    );
  }
}
