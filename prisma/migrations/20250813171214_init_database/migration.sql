-- CreateEnum
CREATE TYPE "public"."RoleEnum" AS ENUM ('USER', 'ADMIN', 'ACCOUNTING');

-- CreateEnum
CREATE TYPE "public"."ProjectPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "public"."NOTIFICATION_STATUS" AS ENUM ('SEEN', 'UNSEEN');

-- CreateEnum
CREATE TYPE "public"."NotificationType" AS ENUM ('INFO', 'WARNING', 'ERROR', 'SUCCESS', 'PROJECT_UPDATE', 'DEADLINE_REMINDER', 'STATUS_CHANGE');

-- CreateTable
CREATE TABLE "public"."FileSystem" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "items" INTEGER,
    "path" TEXT[],
    "color" TEXT,
    "createdById" INTEGER NOT NULL,
    "projectId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FileSystem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."User" (
    "id" SERIAL NOT NULL,
    "uuid" UUID,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "avatar" TEXT,
    "jobTitle" TEXT,
    "department" TEXT,
    "phoneNumber" TEXT,
    "role" "public"."RoleEnum" NOT NULL DEFAULT 'USER',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Project" (
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
    "priority" "public"."ProjectPriority" NOT NULL DEFAULT 'MEDIUM',
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PaymentChannel" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT,
    "logoUrl" TEXT,

    CONSTRAINT "PaymentChannel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."JobType" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "JobType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."JobStatus" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "thumbnail" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ProjectStatusChange" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER NOT NULL,
    "fromStatusId" INTEGER,
    "toStatusId" INTEGER NOT NULL,
    "changedById" INTEGER NOT NULL,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProjectStatusChange_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TimeEntry" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "projectId" INTEGER NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3),
    "duration" INTEGER,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TimeEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserNotification" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "notificationId" INTEGER NOT NULL,
    "status" "public"."NOTIFICATION_STATUS" NOT NULL DEFAULT 'UNSEEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserNotification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Notification" (
    "id" SERIAL NOT NULL,
    "title" TEXT,
    "content" TEXT NOT NULL,
    "image" TEXT,
    "type" "public"."NotificationType" NOT NULL DEFAULT 'INFO',
    "relatedProjectId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_VisibleToUsers" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_VisibleToUsers_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_UserProjects" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_UserProjects_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "FileSystem_createdById_idx" ON "public"."FileSystem"("createdById");

-- CreateIndex
CREATE INDEX "FileSystem_projectId_idx" ON "public"."FileSystem"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "public"."User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Project_jobNo_key" ON "public"."Project"("jobNo");

-- CreateIndex
CREATE INDEX "Project_jobStatusId_idx" ON "public"."Project"("jobStatusId");

-- CreateIndex
CREATE INDEX "Project_createdById_idx" ON "public"."Project"("createdById");

-- CreateIndex
CREATE INDEX "Project_priority_idx" ON "public"."Project"("priority");

-- CreateIndex
CREATE INDEX "JobStatus_order_idx" ON "public"."JobStatus"("order");

-- CreateIndex
CREATE INDEX "ProjectStatusChange_projectId_changedAt_idx" ON "public"."ProjectStatusChange"("projectId", "changedAt");

-- CreateIndex
CREATE INDEX "ProjectStatusChange_changedById_idx" ON "public"."ProjectStatusChange"("changedById");

-- CreateIndex
CREATE INDEX "TimeEntry_userId_idx" ON "public"."TimeEntry"("userId");

-- CreateIndex
CREATE INDEX "TimeEntry_projectId_idx" ON "public"."TimeEntry"("projectId");

-- CreateIndex
CREATE INDEX "TimeEntry_startTime_idx" ON "public"."TimeEntry"("startTime");

-- CreateIndex
CREATE INDEX "UserNotification_userId_status_idx" ON "public"."UserNotification"("userId", "status");

-- CreateIndex
CREATE INDEX "Notification_type_idx" ON "public"."Notification"("type");

-- CreateIndex
CREATE INDEX "Notification_createdAt_idx" ON "public"."Notification"("createdAt");

-- CreateIndex
CREATE INDEX "_VisibleToUsers_B_index" ON "public"."_VisibleToUsers"("B");

-- CreateIndex
CREATE INDEX "_UserProjects_B_index" ON "public"."_UserProjects"("B");

-- AddForeignKey
ALTER TABLE "public"."FileSystem" ADD CONSTRAINT "FileSystem_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FileSystem" ADD CONSTRAINT "FileSystem_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Project" ADD CONSTRAINT "Project_jobTypeId_fkey" FOREIGN KEY ("jobTypeId") REFERENCES "public"."JobType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Project" ADD CONSTRAINT "Project_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Project" ADD CONSTRAINT "Project_paymentChannelId_fkey" FOREIGN KEY ("paymentChannelId") REFERENCES "public"."PaymentChannel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Project" ADD CONSTRAINT "Project_jobStatusId_fkey" FOREIGN KEY ("jobStatusId") REFERENCES "public"."JobStatus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProjectStatusChange" ADD CONSTRAINT "ProjectStatusChange_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProjectStatusChange" ADD CONSTRAINT "ProjectStatusChange_fromStatusId_fkey" FOREIGN KEY ("fromStatusId") REFERENCES "public"."JobStatus"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProjectStatusChange" ADD CONSTRAINT "ProjectStatusChange_toStatusId_fkey" FOREIGN KEY ("toStatusId") REFERENCES "public"."JobStatus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProjectStatusChange" ADD CONSTRAINT "ProjectStatusChange_changedById_fkey" FOREIGN KEY ("changedById") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TimeEntry" ADD CONSTRAINT "TimeEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TimeEntry" ADD CONSTRAINT "TimeEntry_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserNotification" ADD CONSTRAINT "UserNotification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserNotification" ADD CONSTRAINT "UserNotification_notificationId_fkey" FOREIGN KEY ("notificationId") REFERENCES "public"."Notification"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_VisibleToUsers" ADD CONSTRAINT "_VisibleToUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."FileSystem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_VisibleToUsers" ADD CONSTRAINT "_VisibleToUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_UserProjects" ADD CONSTRAINT "_UserProjects_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_UserProjects" ADD CONSTRAINT "_UserProjects_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
