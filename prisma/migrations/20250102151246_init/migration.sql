/*
  Warnings:

  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `_team-leaders` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `clubId` to the `Team` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_team-leaders" DROP CONSTRAINT "_team-leaders_A_fkey";

-- DropForeignKey
ALTER TABLE "_team-leaders" DROP CONSTRAINT "_team-leaders_B_fkey";

-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "clubId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role",
ADD COLUMN     "permissions" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- DropTable
DROP TABLE "_team-leaders";

-- CreateTable
CREATE TABLE "Club" (
    "clubId" TEXT NOT NULL,
    "clubName" TEXT NOT NULL,

    CONSTRAINT "Club_pkey" PRIMARY KEY ("clubId")
);

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("clubId") ON DELETE RESTRICT ON UPDATE CASCADE;
