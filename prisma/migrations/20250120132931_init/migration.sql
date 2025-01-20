-- AlterTable
ALTER TABLE "_clubLead" ADD CONSTRAINT "_clubLead_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_clubLead_AB_unique";

-- AlterTable
ALTER TABLE "_teamLeader" ADD CONSTRAINT "_teamLeader_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_teamLeader_AB_unique";

-- AlterTable
ALTER TABLE "_teamMembers" ADD CONSTRAINT "_teamMembers_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_teamMembers_AB_unique";
