/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `Config` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Config_code_key" ON "public"."Config"("code");
