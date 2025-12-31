-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "eventId" TEXT,
ADD COLUMN     "likeCount" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "PostEvent" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "location" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "redirectUrl" TEXT,
    "thumbnailUrl" TEXT,
    "postId" TEXT NOT NULL,

    CONSTRAINT "PostEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PostEvent_postId_key" ON "PostEvent"("postId");

-- AddForeignKey
ALTER TABLE "PostEvent" ADD CONSTRAINT "PostEvent_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
