-- CreateEnum
CREATE TYPE "SecurityLogStatus" AS ENUM ('SUCCESS', 'FAILED', 'WARNING');

-- CreateTable
CREATE TABLE "UserSecurityLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "event" TEXT NOT NULL,
    "status" "SecurityLogStatus" NOT NULL DEFAULT 'SUCCESS',
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserSecurityLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserSecurityLog_userId_idx" ON "UserSecurityLog"("userId");

-- CreateIndex
CREATE INDEX "UserSecurityLog_createdAt_idx" ON "UserSecurityLog"("createdAt");

-- AddForeignKey
ALTER TABLE "UserSecurityLog" ADD CONSTRAINT "UserSecurityLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
