/*
  Warnings:

  - You are about to drop the column `sourceUrl` on the `Job` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Job" DROP COLUMN "sourceUrl",
ADD COLUMN     "attachmentUrls" TEXT[];
