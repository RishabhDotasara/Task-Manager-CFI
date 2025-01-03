-- CreateTable
CREATE TABLE "_teamLeader" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_teamLeader_AB_unique" ON "_teamLeader"("A", "B");

-- CreateIndex
CREATE INDEX "_teamLeader_B_index" ON "_teamLeader"("B");

-- AddForeignKey
ALTER TABLE "_teamLeader" ADD CONSTRAINT "_teamLeader_A_fkey" FOREIGN KEY ("A") REFERENCES "Team"("teamId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_teamLeader" ADD CONSTRAINT "_teamLeader_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
