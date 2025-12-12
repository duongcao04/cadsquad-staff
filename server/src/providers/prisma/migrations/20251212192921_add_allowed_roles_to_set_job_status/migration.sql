-- AlterTable
ALTER TABLE "JobStatus" ADD COLUMN     "allowedRolesToSet" "RoleEnum"[] DEFAULT ARRAY['ADMIN']::"RoleEnum"[];
