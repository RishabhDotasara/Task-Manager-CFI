import { prisma } from "@/lib/prisma";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';


export async function GET(req: NextRequest) {
  try {
    
    const { searchParams } = new URL(req.url);
    const leaderId = searchParams.get("leaderId");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    
    const teams = await prisma.team.findMany({
      take:limit,
      skip: (page-1) * limit,
      include:{
        leaders:true,
        members:true
      },
      where:{
        leaders:{
          some:{
            userId:leaderId || ""
          }
        }
      }
    })
  
    return NextResponse.json(
      { teams:teams || [], message: "Teams Fetched by LeaderId " + leaderId },
      { status: 200 }
    );
  } catch (err) {
    console.error(`[ERROR] Get Team By Leader Endpoint: ${err}`);
    return NextResponse.json(
      { error: "Failed to get teams by leader" },
      { status: 500 }
    );
  }
}
