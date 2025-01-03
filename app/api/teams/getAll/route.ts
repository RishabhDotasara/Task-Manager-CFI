import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";


export const dynamic = 'force-dynamic'
export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const prisma = new PrismaClient();
    const {searchParams} = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const teams = await prisma.team.findMany({
      take: limit,
      skip: (page - 1) * limit,
      include: {
        leaders:true,
        members:true
      },
    });
    prisma.$disconnect();
    return NextResponse.json(
      { message: "Teams Fetched", teams: teams },
      { status: 200 }
    );
  } catch (er) {
    console.log(er);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
