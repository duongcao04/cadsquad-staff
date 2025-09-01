-- CreateEnum
CREATE TYPE "public"."RoleEnum" AS ENUM ('USER', 'ADMIN', 'ACCOUNTING');

-- CreateEnum
CREATE TYPE "public"."JobPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "public"."ACTIVITY_TYPE" AS ENUM ('CreateJob', 'ChangeStatus', 'AssignMember', 'UnassignMember', 'ChangePaymentChannel', 'UpdateInformation', 'DeleteJob');

-- CreateEnum
CREATE TYPE "public"."NOTIFICATION_STATUS" AS ENUM ('SEEN', 'UNSEEN');

-- CreateEnum
CREATE TYPE "public"."NotificationType" AS ENUM ('INFO', 'WARNING', 'ERROR', 'SUCCESS', 'JOB_UPDATE', 'DEADLINE_REMINDER', 'STATUS_CHANGE');

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
    "jobId" INTEGER,
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
CREATE TABLE "public"."Job" (
    "id" SERIAL NOT NULL,
    "jobTypeId" INTEGER NOT NULL,
    "jobNo" TEXT NOT NULL,
    "jobName" TEXT NOT NULL,
    "description" TEXT,
    "sourceUrl" TEXT,
    "clientName" TEXT NOT NULL,
    "income" INTEGER NOT NULL,
    "staffCost" INTEGER NOT NULL,
    "createdById" INTEGER NOT NULL,
    "paymentChannelId" INTEGER NOT NULL,
    "statusId" INTEGER NOT NULL,
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
    "icon" TEXT,
    "nextStatusId" INTEGER,
    "prevStatusId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."JobActivityLog" (
    "id" SERIAL NOT NULL,
    "jobId" INTEGER NOT NULL,
    "previousValue" TEXT NOT NULL,
    "currentValue" TEXT NOT NULL,
    "modifiedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedById" INTEGER NOT NULL,
    "fieldName" TEXT NOT NULL,
    "activityType" "public"."ACTIVITY_TYPE" NOT NULL,
    "notes" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JobActivityLog_pkey" PRIMARY KEY ("id")
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
    "senderId" INTEGER,
    "type" "public"."NotificationType" NOT NULL DEFAULT 'INFO',
    "relatedJobId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_VisibleToUsers" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_VisibleToUsers_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_UserJobs" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_UserJobs_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "FileSystem_createdById_idx" ON "public"."FileSystem"("createdById");

-- CreateIndex
CREATE INDEX "FileSystem_jobId_idx" ON "public"."FileSystem"("jobId");

-- CreateIndex
CREATE UNIQUE INDEX "User_uuid_key" ON "public"."User"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "public"."User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Job_jobNo_key" ON "public"."Job"("jobNo");

-- CreateIndex
CREATE INDEX "Job_statusId_idx" ON "public"."Job"("statusId");

-- CreateIndex
CREATE INDEX "Job_createdById_idx" ON "public"."Job"("createdById");

-- CreateIndex
CREATE INDEX "Job_priority_idx" ON "public"."Job"("priority");

-- CreateIndex
CREATE UNIQUE INDEX "JobStatus_order_key" ON "public"."JobStatus"("order");

-- CreateIndex
CREATE INDEX "JobStatus_order_idx" ON "public"."JobStatus"("order");

-- CreateIndex
CREATE INDEX "JobActivityLog_jobId_modifiedAt_idx" ON "public"."JobActivityLog"("jobId", "modifiedAt");

-- CreateIndex
CREATE INDEX "JobActivityLog_modifiedById_idx" ON "public"."JobActivityLog"("modifiedById");

-- CreateIndex
CREATE INDEX "UserNotification_userId_status_idx" ON "public"."UserNotification"("userId", "status");

-- CreateIndex
CREATE INDEX "Notification_type_idx" ON "public"."Notification"("type");

-- CreateIndex
CREATE INDEX "Notification_createdAt_idx" ON "public"."Notification"("createdAt");

-- CreateIndex
CREATE INDEX "_VisibleToUsers_B_index" ON "public"."_VisibleToUsers"("B");

-- CreateIndex
CREATE INDEX "_UserJobs_B_index" ON "public"."_UserJobs"("B");

-- AddForeignKey
ALTER TABLE "public"."FileSystem" ADD CONSTRAINT "FileSystem_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FileSystem" ADD CONSTRAINT "FileSystem_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "public"."Job"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Job" ADD CONSTRAINT "Job_jobTypeId_fkey" FOREIGN KEY ("jobTypeId") REFERENCES "public"."JobType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Job" ADD CONSTRAINT "Job_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Job" ADD CONSTRAINT "Job_paymentChannelId_fkey" FOREIGN KEY ("paymentChannelId") REFERENCES "public"."PaymentChannel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Job" ADD CONSTRAINT "Job_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "public"."JobStatus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."JobActivityLog" ADD CONSTRAINT "JobActivityLog_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "public"."Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."JobActivityLog" ADD CONSTRAINT "JobActivityLog_modifiedById_fkey" FOREIGN KEY ("modifiedById") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserNotification" ADD CONSTRAINT "UserNotification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserNotification" ADD CONSTRAINT "UserNotification_notificationId_fkey" FOREIGN KEY ("notificationId") REFERENCES "public"."Notification"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Notification" ADD CONSTRAINT "Notification_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_VisibleToUsers" ADD CONSTRAINT "_VisibleToUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."FileSystem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_VisibleToUsers" ADD CONSTRAINT "_VisibleToUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_UserJobs" ADD CONSTRAINT "_UserJobs_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_UserJobs" ADD CONSTRAINT "_UserJobs_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
