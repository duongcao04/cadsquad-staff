/*
  Warnings:

  - A unique constraint covering the columns `[order]` on the table `JobStatus` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "JobStatus_order_key" ON "public"."JobStatus"("order");
