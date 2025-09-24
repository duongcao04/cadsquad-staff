/*
  Warnings:

  - The `status` column on the `Notification` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `provider` on the `Account` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `activityType` on the `JobActivityLog` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."AccountProvider" AS ENUM ('GOOGLE', 'GITHUB', 'MICROSOFT', 'FACEBOOK', 'LOCAL');

-- CreateEnum
CREATE TYPE "public"."ActivityType" AS ENUM ('CreateJob', 'ChangeStatus', 'AssignMember', 'UnassignMember', 'ChangePaymentChannel', 'UpdateInformation', 'DeleteJob');

-- CreateEnum
CREATE TYPE "public"."NotificationStatus" AS ENUM ('SEEN', 'UNSEEN');

-- DropIndex
DROP INDEX "public"."Config_code_key";

-- AlterTable
ALTER TABLE "public"."Account" DROP COLUMN "provider",
ADD COLUMN     "provider" "public"."AccountProvider" NOT NULL;

-- AlterTable
ALTER TABLE "public"."JobActivityLog" DROP COLUMN "activityType",
ADD COLUMN     "activityType" "public"."ActivityType" NOT NULL;

-- AlterTable
ALTER TABLE "public"."Notification" DROP COLUMN "status",
ADD COLUMN     "status" "public"."NotificationStatus" NOT NULL DEFAULT 'UNSEEN';

-- DropEnum
DROP TYPE "public"."ACCOUNT_PROVIDER";

-- DropEnum
DROP TYPE "public"."ActivityType";

-- DropEnum
DROP TYPE "public"."NOTIFICATION_STATUS";

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerId_key" ON "public"."Account"("provider", "providerId");

-- CreateIndex
CREATE INDEX "Notification_userId_status_idx" ON "public"."Notification"("userId", "status");
