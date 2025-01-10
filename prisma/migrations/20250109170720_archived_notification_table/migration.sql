-- CreateTable
CREATE TABLE "ArchivedNotification" (
    "notificationId" SERIAL NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "actionUrl" TEXT NOT NULL,
    "requestType" "RequestType",
    "toKeep" BOOLEAN NOT NULL DEFAULT true,
    "senderIdentity" TEXT NOT NULL,
    "receiverIdentity" TEXT NOT NULL,

    CONSTRAINT "ArchivedNotification_pkey" PRIMARY KEY ("notificationId")
);
