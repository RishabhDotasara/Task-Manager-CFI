import { permissions } from "@/permissionManager/permissions";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();
    const prisma = new PrismaClient();

    const user = await prisma.user.findUnique({
      where: {
        userId: userId,
      },
      select: {
        permissions: true,
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found!" }, { status: 404 });
    }

    const newPermissions = [...user.permissions].filter(
      (permission) => permission !== permissions.admin.admin
    );

    await prisma.user.update({
      where: {
        userId: userId,
      },
      data: {
        permissions: {
          set: newPermissions,
        },
      },
    });

    return NextResponse.json({ message: "Admin Removed!" }, { status: 200 });
  } catch (err) {
    console.error(`[ERROR] Remove Admin Endpoint: ${err}`);
    return NextResponse.json(
      { message: "Internal Server Error!" },
      { status: 500 }
    );
  }
}
