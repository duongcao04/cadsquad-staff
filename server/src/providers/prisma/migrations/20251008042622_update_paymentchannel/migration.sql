-- DropForeignKey
ALTER TABLE "public"."Job" DROP CONSTRAINT "Job_paymentChannelId_fkey";

-- AlterTable
ALTER TABLE "public"."Job" ALTER COLUMN "paymentChannelId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Job" ADD CONSTRAINT "Job_paymentChannelId_fkey" FOREIGN KEY ("paymentChannelId") REFERENCES "public"."PaymentChannel"("id") ON DELETE SET NULL ON UPDATE CASCADE;
