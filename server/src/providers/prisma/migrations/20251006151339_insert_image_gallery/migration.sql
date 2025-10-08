-- CreateTable
CREATE TABLE "public"."ImageGallery" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "url" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ImageGallery_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."ImageGallery" ADD CONSTRAINT "ImageGallery_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
