/*
  Warnings:

  - A unique constraint covering the columns `[userId,type]` on the table `UserDevices` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UserDevices_userId_type_key" ON "UserDevices"("userId", "type");
