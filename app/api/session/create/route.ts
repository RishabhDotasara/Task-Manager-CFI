import { prisma } from "@/lib/prisma";
import { User } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest)
{
    try 
    {
        const body = await req.json()
        // console.log(body)
        const session = await prisma.session.create({
            data:{
                date:body.date,
                description:body.description,
                endTime:body.endTime,   
                eventType:body.eventType,
                startTime:body.startTime,
                title:body.title,
                location:body.location,
                teamId:body.teamId
            },
            include:{
                team:{
                    include:{
                        members:true
                    }
                }
            }   
        })

        session.team.members.map(async (user:User)=>{
            
            await prisma.notification.create({
            data:{
                message:"new event scheduled : " + session.title,
                actionUrl:"/session-scheduler",
                title:"New Event",
                type:"EVENT",
                senderId:body.creatorId,
                receiverId:user.userId,
                toKeep:true,
                timestamp:new Date(),
            }
        })
        })

        // createEvent({
        //     summary: body.title,
        //     description: body.description,
        //     location: body.location,
        //     start: body.startTime,
        //     end: body.endTime,
        //     attendees: session.team.members.map((member) => member.email)
        // })

        return NextResponse.json({message:"Success"}, {status:200})
    }
    catch(err)
    {
        console.log(`[ERROR] Create Session Endpoint: ${err}`)
        return NextResponse.json({message:"Internal Server Error!"}, {status:500})
    }
}