-- AlterTable
ALTER TABLE "User" ALTER COLUMN "jobTitle" DROP NOT NULL,
ALTER COLUMN "department" DROP NOT NULL;

-- CreateTable
CREATE TABLE "FileSystem" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "items" INTEGER,
    "path" TEXT[],
    "createdById" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FileSystem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_VisibleToUsers" (
    "A" TEXT NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_VisibleToUsers_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_VisibleToUsers_B_index" ON "_VisibleToUsers"("B");

-- AddForeignKey
ALTER TABLE "FileSystem" ADD CONSTRAINT "FileSystem_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_VisibleToUsers" ADD CONSTRAINT "_VisibleToUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "FileSystem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_VisibleToUsers" ADD CONSTRAINT "_VisibleToUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
