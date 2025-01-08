import { Notification, PrismaClient } from "@prisma/client";

export async function generateNotification({
    title,
    message,
    actionUrl,
    type,
    toKeep,
    senderId,
    receiverId,
    requestType,
}: Pick<
    Notification,
    | "title"
    | "message"
    | "actionUrl"
    | "type"
    | "toKeep"
    | "senderId"
    | "receiverId"
> & { requestType?: Notification["requestType"] }) {
    try {
        const prisma = new PrismaClient();
        const notification = await prisma.notification.create({
            data: {
                actionUrl: actionUrl,
                title: title,
                message: message,
                receiverId: receiverId,
                senderId: senderId,
                requestType: requestType,
                type: type,
            },
        });

        return notification;
    } catch (err) {
        console.error(`[ERROR] Notification Generator Function: ${err}`);
        return null;
    }
}
