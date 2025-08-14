/*
  Warnings:

  - You are about to drop the column `nextStatus` on the `JobStatus` table. All the data in the column will be lost.
  - You are about to drop the column `prevStatus` on the `JobStatus` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."JobStatus" DROP COLUMN "nextStatus",
DROP COLUMN "prevStatus",
ADD COLUMN     "nextStatusId" INTEGER,
ADD COLUMN     "prevStatusId" INTEGER;
