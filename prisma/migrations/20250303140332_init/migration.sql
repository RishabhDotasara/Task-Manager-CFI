/*
  Warnings:

  - You are about to drop the column `sender` on the `Message` table. All the data in the column will be lost.
  - The primary key for the `_clubLead` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `_teamLeader` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `_teamMembers` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[A,B]` on the table `_clubLead` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[A,B]` on the table `_teamLeader` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[A,B]` on the table `_teamMembers` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `receiverId` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senderId` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Message" DROP COLUMN "sender",
ADD COLUMN     "receiverId" TEXT NOT NULL,
ADD COLUMN     "senderId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "_clubLead" DROP CONSTRAINT "_clubLead_AB_pkey";

-- AlterTable
ALTER TABLE "_teamLeader" DROP CONSTRAINT "_teamLeader_AB_pkey";

-- AlterTable
ALTER TABLE "_teamMembers" DROP CONSTRAINT "_teamMembers_AB_pkey";

-- CreateIndex
CREATE UNIQUE INDEX "_clubLead_AB_unique" ON "_clubLead"("A", "B");

-- CreateIndex
CREATE UNIQUE INDEX "_teamLeader_AB_unique" ON "_teamLeader"("A", "B");

-- CreateIndex
CREATE UNIQUE INDEX "_teamMembers_AB_unique" ON "_teamMembers"("A", "B");

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
