/*
  Warnings:

  - You are about to drop the column `createdAt` on the `JobActivityLog` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."JobActivityLog" DROP COLUMN "createdAt",
ALTER COLUMN "previousValue" DROP NOT NULL,
ALTER COLUMN "currentValue" DROP NOT NULL,
ALTER COLUMN "notes" DROP NOT NULL;
