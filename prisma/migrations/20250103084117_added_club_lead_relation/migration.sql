-- CreateTable
CREATE TABLE "_clubLead" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_clubLead_AB_unique" ON "_clubLead"("A", "B");

-- CreateIndex
CREATE INDEX "_clubLead_B_index" ON "_clubLead"("B");

-- AddForeignKey
ALTER TABLE "_clubLead" ADD CONSTRAINT "_clubLead_A_fkey" FOREIGN KEY ("A") REFERENCES "Club"("clubId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_clubLead" ADD CONSTRAINT "_clubLead_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
