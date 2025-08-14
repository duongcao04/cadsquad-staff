/*
  Warnings:

  - The values [PROJECT_UPDATE] on the enum `NotificationType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `projectId` on the `FileSystem` table. All the data in the column will be lost.
  - You are about to drop the column `relatedProjectId` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `projectId` on the `TimeEntry` table. All the data in the column will be lost.
  - You are about to drop the `Project` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProjectStatusChange` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_UserProjects` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `jobId` to the `TimeEntry` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."JobPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- AlterEnum
BEGIN;
CREATE TYPE "public"."NotificationType_new" AS ENUM ('INFO', 'WARNING', 'ERROR', 'SUCCESS', 'JOB_UPDATE', 'DEADLINE_REMINDER', 'STATUS_CHANGE');
ALTER TABLE "public"."Notification" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "public"."Notification" ALTER COLUMN "type" TYPE "public"."NotificationType_new" USING ("type"::text::"public"."NotificationType_new");
ALTER TYPE "public"."NotificationType" RENAME TO "NotificationType_old";
ALTER TYPE "public"."NotificationType_new" RENAME TO "NotificationType";
DROP TYPE "public"."NotificationType_old";
ALTER TABLE "public"."Notification" ALTER COLUMN "type" SET DEFAULT 'INFO';
COMMIT;

-- DropForeignKey
ALTER TABLE "public"."FileSystem" DROP CONSTRAINT "FileSystem_projectId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Project" DROP CONSTRAINT "Project_createdById_fkey";

-- DropForeignKey
ALTER TABLE "public"."Project" DROP CONSTRAINT "Project_jobStatusId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Project" DROP CONSTRAINT "Project_jobTypeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Project" DROP CONSTRAINT "Project_paymentChannelId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ProjectStatusChange" DROP CONSTRAINT "ProjectStatusChange_changedById_fkey";

-- DropForeignKey
ALTER TABLE "public"."ProjectStatusChange" DROP CONSTRAINT "ProjectStatusChange_fromStatusId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ProjectStatusChange" DROP CONSTRAINT "ProjectStatusChange_projectId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ProjectStatusChange" DROP CONSTRAINT "ProjectStatusChange_toStatusId_fkey";

-- DropForeignKey
ALTER TABLE "public"."TimeEntry" DROP CONSTRAINT "TimeEntry_projectId_fkey";

-- DropForeignKey
ALTER TABLE "public"."_UserProjects" DROP CONSTRAINT "_UserProjects_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_UserProjects" DROP CONSTRAINT "_UserProjects_B_fkey";

-- DropIndex
DROP INDEX "public"."FileSystem_projectId_idx";

-- DropIndex
DROP INDEX "public"."TimeEntry_projectId_idx";

-- AlterTable
ALTER TABLE "public"."FileSystem" DROP COLUMN "projectId",
ADD COLUMN     "jobId" INTEGER;

-- AlterTable
ALTER TABLE "public"."Notification" DROP COLUMN "relatedProjectId",
ADD COLUMN     "relatedJobId" INTEGER;

-- AlterTable
ALTER TABLE "public"."TimeEntry" DROP COLUMN "projectId",
ADD COLUMN     "jobId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "public"."Project";

-- DropTable
DROP TABLE "public"."ProjectStatusChange";

-- DropTable
DROP TABLE "public"."_UserProjects";

-- DropEnum
DROP TYPE "public"."ProjectPriority";

-- CreateTable
CREATE TABLE "public"."Job" (
    "id" SERIAL NOT NULL,
    "jobTypeId" INTEGER NOT NULL,
    "jobNo" TEXT NOT NULL,
    "jobName" TEXT NOT NULL,
    "description" TEXT,
    "sourceUrl" TEXT NOT NULL,
    "clientName" TEXT NOT NULL,
    "income" INTEGER NOT NULL,
    "staffCost" INTEGER NOT NULL,
    "createdById" INTEGER NOT NULL,
    "paymentChannelId" INTEGER NOT NULL,
    "jobStatusId" INTEGER NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dueAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),
    "priority" "public"."JobPriority" NOT NULL DEFAULT 'MEDIUM',
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."JobStatusChange" (
    "id" SERIAL NOT NULL,
    "jobId" INTEGER NOT NULL,
    "fromStatusId" INTEGER,
    "toStatusId" INTEGER NOT NULL,
    "changedById" INTEGER NOT NULL,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JobStatusChange_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_UserJobs" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_UserJobs_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Job_jobNo_key" ON "public"."Job"("jobNo");

-- CreateIndex
CREATE INDEX "Job_jobStatusId_idx" ON "public"."Job"("jobStatusId");

-- CreateIndex
CREATE INDEX "Job_createdById_idx" ON "public"."Job"("createdById");

-- CreateIndex
CREATE INDEX "Job_priority_idx" ON "public"."Job"("priority");

-- CreateIndex
CREATE INDEX "JobStatusChange_jobId_changedAt_idx" ON "public"."JobStatusChange"("jobId", "changedAt");

-- CreateIndex
CREATE INDEX "JobStatusChange_changedById_idx" ON "public"."JobStatusChange"("changedById");

-- CreateIndex
CREATE INDEX "_UserJobs_B_index" ON "public"."_UserJobs"("B");

-- CreateIndex
CREATE INDEX "FileSystem_jobId_idx" ON "public"."FileSystem"("jobId");

-- CreateIndex
CREATE INDEX "TimeEntry_jobId_idx" ON "public"."TimeEntry"("jobId");

-- AddForeignKey
ALTER TABLE "public"."FileSystem" ADD CONSTRAINT "FileSystem_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "public"."Job"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Job" ADD CONSTRAINT "Job_jobTypeId_fkey" FOREIGN KEY ("jobTypeId") REFERENCES "public"."JobType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Job" ADD CONSTRAINT "Job_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Job" ADD CONSTRAINT "Job_paymentChannelId_fkey" FOREIGN KEY ("paymentChannelId") REFERENCES "public"."PaymentChannel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Job" ADD CONSTRAINT "Job_jobStatusId_fkey" FOREIGN KEY ("jobStatusId") REFERENCES "public"."JobStatus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."JobStatusChange" ADD CONSTRAINT "JobStatusChange_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "public"."Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."JobStatusChange" ADD CONSTRAINT "JobStatusChange_fromStatusId_fkey" FOREIGN KEY ("fromStatusId") REFERENCES "public"."JobStatus"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."JobStatusChange" ADD CONSTRAINT "JobStatusChange_toStatusId_fkey" FOREIGN KEY ("toStatusId") REFERENCES "public"."JobStatus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."JobStatusChange" ADD CONSTRAINT "JobStatusChange_changedById_fkey" FOREIGN KEY ("changedById") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TimeEntry" ADD CONSTRAINT "TimeEntry_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "public"."Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_UserJobs" ADD CONSTRAINT "_UserJobs_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_UserJobs" ADD CONSTRAINT "_UserJobs_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
