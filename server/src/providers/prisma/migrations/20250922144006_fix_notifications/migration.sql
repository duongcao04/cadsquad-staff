/*
  Warnings:

  - You are about to drop the `UserNotification` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."UserNotification" DROP CONSTRAINT "UserNotification_notificationId_fkey";

-- DropForeignKey
ALTER TABLE "public"."UserNotification" DROP CONSTRAINT "UserNotification_userId_fkey";

-- AlterTable
ALTER TABLE "public"."Notification" ADD COLUMN     "status" "public"."NOTIFICATION_STATUS" NOT NULL DEFAULT 'UNSEEN';

-- DropTable
DROP TABLE "public"."UserNotification";

-- CreateIndex
CREATE INDEX "Notification_userId_status_idx" ON "public"."Notification"("userId", "status");

-- AddForeignKey
ALTER TABLE "public"."Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
