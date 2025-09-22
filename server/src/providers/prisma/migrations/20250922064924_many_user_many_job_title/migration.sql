/*
  Warnings:

  - You are about to drop the column `jobTitleId` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."User" DROP CONSTRAINT "User_jobTitleId_fkey";

-- AlterTable
ALTER TABLE "public"."JobTitle" ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "jobTitleId";

-- CreateTable
CREATE TABLE "public"."_UserJobTitles" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_UserJobTitles_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_UserJobTitles_B_index" ON "public"."_UserJobTitles"("B");

-- AddForeignKey
ALTER TABLE "public"."_UserJobTitles" ADD CONSTRAINT "_UserJobTitles_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."JobTitle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_UserJobTitles" ADD CONSTRAINT "_UserJobTitles_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
