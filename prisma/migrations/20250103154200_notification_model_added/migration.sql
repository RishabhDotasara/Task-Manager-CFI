-- CreateEnum
CREATE TYPE "RequestType" AS ENUM ('FEATURE', 'BUG');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('COMMENT', 'TASK', 'TEAM', 'EVENT', 'UPDATE', 'REQUEST');

-- CreateTable
CREATE TABLE "Notification" (
    "notificationId" SERIAL NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "read" BOOLEAN NOT NULL,
    "actionUrl" TEXT NOT NULL,
    "requestType" "RequestType" NOT NULL,
    "toKeep" BOOLEAN NOT NULL,
    "senderId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("notificationId")
);

-- CreateIndex
CREATE INDEX "Notification_senderId_idx" ON "Notification"("senderId");

-- CreateIndex
CREATE INDEX "Notification_receiverId_idx" ON "Notification"("receiverId");

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
