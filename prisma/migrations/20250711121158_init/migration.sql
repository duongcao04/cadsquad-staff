/*
  Warnings:

  - The primary key for the `FileSystem` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `FileSystem` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `_VisibleToUsers` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `A` on the `_VisibleToUsers` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "_VisibleToUsers" DROP CONSTRAINT "_VisibleToUsers_A_fkey";

-- AlterTable
ALTER TABLE "FileSystem" DROP CONSTRAINT "FileSystem_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "FileSystem_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "_VisibleToUsers" DROP CONSTRAINT "_VisibleToUsers_AB_pkey",
DROP COLUMN "A",
ADD COLUMN     "A" INTEGER NOT NULL,
ADD CONSTRAINT "_VisibleToUsers_AB_pkey" PRIMARY KEY ("A", "B");

-- AddForeignKey
ALTER TABLE "_VisibleToUsers" ADD CONSTRAINT "_VisibleToUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "FileSystem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
