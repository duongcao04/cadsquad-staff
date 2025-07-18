/*
  Warnings:

  - You are about to drop the column `price` on the `Project` table. All the data in the column will be lost.
  - Added the required column `clientName` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `income` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `jobTypeId` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentChannelId` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `staffCost` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "price",
ADD COLUMN     "clientName" TEXT NOT NULL,
ADD COLUMN     "income" INTEGER NOT NULL,
ADD COLUMN     "jobTypeId" INTEGER NOT NULL,
ADD COLUMN     "paymentChannelId" INTEGER NOT NULL,
ADD COLUMN     "staffCost" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "PaymentChannel" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT,
    "logoUrl" TEXT,

    CONSTRAINT "PaymentChannel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobType" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "JobType_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_jobTypeId_fkey" FOREIGN KEY ("jobTypeId") REFERENCES "JobType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_paymentChannelId_fkey" FOREIGN KEY ("paymentChannelId") REFERENCES "PaymentChannel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
