import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req:NextRequest)
{
    try 
    {
        const {searchParams} = new URL(req.url)
        const senderId = searchParams.get("senderId")
        const receiverId = searchParams.get("receiverId")
        const exp = searchParams.get("exp")
        console.log(senderId, receiverId)
        const messages = await prisma.message.findMany({
            where: {
                OR: [   
                    {senderId: senderId || "", receiverId: receiverId || ""},
                    {senderId: receiverId || "", receiverId: senderId || ""}
                ]
            },
            orderBy:{
                createdAt: "asc"
            },
            // take: parseInt(exp || "1") * 2
        })
        return NextResponse.json({messages}, {status:200})
    }
    catch(err)
    {
        console.log("Error at message fetching endpoint: ", err)
        return NextResponse.json({
            message:"Internal Server Error"
        }, {status:500})
    }
}