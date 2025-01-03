import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";



export const dynamic = 'force-dynamic'
export async function POST(request: NextRequest) {

    try 
    {
        const prisma = new PrismaClient();
        const body = await request.json();

        // Update the team with the specified teamId
        console.log(body)
        await prisma.team.update({
            where:{
                teamId:body.teamId
            },
            data:{
                name:body.teamName,
                members:{
                    set:body.members.map((memberId:string)=>{
                        return {userId:memberId}
                    })
                },
                leaders:{
                    set:body.leaders.map((leaderId:string)=>{
                        return {userId:leaderId}
                    })
                }
            }
        })

        return NextResponse.json({ message: "Team updated" }, { status: 200 });

    }
    catch(err)
    {
        console.error(err);
        return NextResponse.json(
            { message: "Error updating team" },
            { status: 500 }
        );
    }

}