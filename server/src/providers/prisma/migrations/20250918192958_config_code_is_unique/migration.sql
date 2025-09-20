/*
  Warnings:

  - A unique constraint covering the columns `[userId,code]` on the table `Config` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."Config" DROP CONSTRAINT "Config_userId_fkey";

-- AlterTable
ALTER TABLE "public"."Config" ALTER COLUMN "userId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Config_userId_code_key" ON "public"."Config"("userId", "code");

-- AddForeignKey
ALTER TABLE "public"."Config" ADD CONSTRAINT "Config_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
