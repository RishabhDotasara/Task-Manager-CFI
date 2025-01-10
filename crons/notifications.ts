import { prisma } from "@/lib/prisma"
import { Notification } from "@prisma/client"


const archiveNotifications = async ()=>{
    try 
    {
        console.info("[Archiving Read Notifications] started")

        const notifications = await prisma.notification.findMany({
            where:{
                read:true,
                toKeep:true
            },
            include:{
                sender:true,
                receiver:true
            }
        })

        notifications.map(async (notification:Notification)=>{
            await prisma.archivedNotification.create({
                data:{
                    actionUrl: notification.actionUrl,
                    message:notification.message,
                    receiverIdentity: `${notification.sender.username} | ${notification.sender.employeeId}`,
                    senderIdentity: `${notification.receiver.username} | ${notification.receiver.employeeId}`,
                    title:notification.title,
                    type: notification.type,
                    read:notification.read,
                    requestType:notification.requestType,
                    timestamp:notification.timestamp,
                    toKeep:notification.toKeep,
                }
            })
        })

        console.info(`[Archiving Read Notifications] completed!`)
    }
    catch(err)
    {
        console.error(`[ERROR] Error while Archiving Notifications: ${err}`)
    }
}

