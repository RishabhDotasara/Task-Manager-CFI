-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_teamId_fkey";

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("teamId") ON DELETE CASCADE ON UPDATE CASCADE;
