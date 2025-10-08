/*
  Warnings:

  - You are about to drop the `_UserJobTitles` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."_UserJobTitles" DROP CONSTRAINT "_UserJobTitles_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_UserJobTitles" DROP CONSTRAINT "_UserJobTitles_B_fkey";

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "jobTitleId" TEXT;

-- DropTable
DROP TABLE "public"."_UserJobTitles";

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_jobTitleId_fkey" FOREIGN KEY ("jobTitleId") REFERENCES "public"."JobTitle"("id") ON DELETE SET NULL ON UPDATE CASCADE;
