/*
  Warnings:

  - You are about to drop the `ImageGallery` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."ImageGallery" DROP CONSTRAINT "ImageGallery_userId_fkey";

-- DropTable
DROP TABLE "public"."ImageGallery";

-- CreateTable
CREATE TABLE "public"."Gallery" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "url" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Gallery_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Gallery" ADD CONSTRAINT "Gallery_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
