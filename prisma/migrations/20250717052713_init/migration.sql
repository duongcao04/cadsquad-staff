/*
  Warnings:

  - Added the required column `createdById` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ProjectPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('INFO', 'WARNING', 'ERROR', 'SUCCESS', 'PROJECT_UPDATE', 'DEADLINE_REMINDER', 'STATUS_CHANGE');

-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'PROJECT_MANAGER';

-- AlterTable
ALTER TABLE "FileSystem" ADD COLUMN     "projectId" INTEGER;

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "relatedProjectId" INTEGER,
ADD COLUMN     "type" "NotificationType" NOT NULL DEFAULT 'INFO';

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "createdById" UUID NOT NULL,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "priority" "ProjectPriority" NOT NULL DEFAULT 'MEDIUM';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "lastLoginAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "UserNotification" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "ProjectStatusChange" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER NOT NULL,
    "fromStatusId" INTEGER,
    "toStatusId" INTEGER NOT NULL,
    "changedById" UUID NOT NULL,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProjectStatusChange_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TimeEntry" (
    "id" SERIAL NOT NULL,
    "userId" UUID NOT NULL,
    "projectId" INTEGER NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3),
    "duration" INTEGER,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TimeEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProjectStatusChange_projectId_changedAt_idx" ON "ProjectStatusChange"("projectId", "changedAt");

-- CreateIndex
CREATE INDEX "ProjectStatusChange_changedById_idx" ON "ProjectStatusChange"("changedById");

-- CreateIndex
CREATE INDEX "TimeEntry_userId_idx" ON "TimeEntry"("userId");

-- CreateIndex
CREATE INDEX "TimeEntry_projectId_idx" ON "TimeEntry"("projectId");

-- CreateIndex
CREATE INDEX "TimeEntry_startTime_idx" ON "TimeEntry"("startTime");

-- CreateIndex
CREATE INDEX "FileSystem_createdById_idx" ON "FileSystem"("createdById");

-- CreateIndex
CREATE INDEX "FileSystem_projectId_idx" ON "FileSystem"("projectId");

-- CreateIndex
CREATE INDEX "JobStatus_order_idx" ON "JobStatus"("order");

-- CreateIndex
CREATE INDEX "Notification_type_idx" ON "Notification"("type");

-- CreateIndex
CREATE INDEX "Notification_createdAt_idx" ON "Notification"("createdAt");

-- CreateIndex
CREATE INDEX "Project_jobStatusId_idx" ON "Project"("jobStatusId");

-- CreateIndex
CREATE INDEX "Project_createdById_idx" ON "Project"("createdById");

-- CreateIndex
CREATE INDEX "Project_priority_idx" ON "Project"("priority");

-- CreateIndex
CREATE INDEX "UserNotification_userId_status_idx" ON "UserNotification"("userId", "status");

-- AddForeignKey
ALTER TABLE "FileSystem" ADD CONSTRAINT "FileSystem_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectStatusChange" ADD CONSTRAINT "ProjectStatusChange_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectStatusChange" ADD CONSTRAINT "ProjectStatusChange_fromStatusId_fkey" FOREIGN KEY ("fromStatusId") REFERENCES "JobStatus"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectStatusChange" ADD CONSTRAINT "ProjectStatusChange_toStatusId_fkey" FOREIGN KEY ("toStatusId") REFERENCES "JobStatus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectStatusChange" ADD CONSTRAINT "ProjectStatusChange_changedById_fkey" FOREIGN KEY ("changedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimeEntry" ADD CONSTRAINT "TimeEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimeEntry" ADD CONSTRAINT "TimeEntry_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
