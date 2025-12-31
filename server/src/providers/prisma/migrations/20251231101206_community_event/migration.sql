/*
  Warnings:

  - Made the column `redirectUrl` on table `PostEvent` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "PostEvent" ALTER COLUMN "redirectUrl" SET NOT NULL;
