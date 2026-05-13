-- CreateEnum
DO $$ BEGIN
  CREATE TYPE "Role" AS ENUM ('GURU', 'ADMIN');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- AlterTable
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "role" "Role" NOT NULL DEFAULT 'GURU';
