-- AlterTable
ALTER TABLE "public"."JobStatus" ADD COLUMN     "nextStatus" INTEGER,
ADD COLUMN     "prevStatus" INTEGER;
