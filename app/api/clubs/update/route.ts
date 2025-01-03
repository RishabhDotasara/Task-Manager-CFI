import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  try {
    const prisma = new PrismaClient();
    const { clubId, clubName, clubLeads } = await req.json();
    
    const club = await prisma.club.update({
      where: { clubId: clubId },
      data: {
        clubName: clubName,
        clubLeads: {
          connect: clubLeads.map((leadId: string) => {
            return {
              userId: leadId,
            };
          }),
        },
      },
    });

    return NextResponse.json(
      { message: "Club Updated Successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.log(`[ERROR] Club Update Endpoint: ${err}`);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
