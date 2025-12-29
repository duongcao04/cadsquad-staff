/*
  Warnings:

  - You are about to drop the `_UserJobs` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_UserJobs" DROP CONSTRAINT "_UserJobs_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserJobs" DROP CONSTRAINT "_UserJobs_B_fkey";

-- DropTable
DROP TABLE "_UserJobs";
