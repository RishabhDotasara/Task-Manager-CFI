import { prisma } from "@/lib/prisma";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic"

export async function PUT(req: NextRequest) {
  try {
  
    const { searchParams } = new URL(req.url);
    const notId = searchParams.get("notId");

    await prisma.notification.update({
      where: {
        notificationId: parseInt(notId || ""),
      },
      data: {
        read: true,
      },
    });

    return NextResponse.json({ message: "Success!" }, { status: 200 });
  } catch (err) {
    console.log(`[ERROR] Mark Read Endpoint: ${err}`);
    return NextResponse.json(
      { message: "Internal Server Error!" },
      { status: 500 }
    );
  }
}
