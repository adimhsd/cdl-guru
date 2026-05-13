DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'Role') THEN
    CREATE TYPE "Role" AS ENUM ('GURU', 'ADMIN');
  END IF;
END $$;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "role" "Role" NOT NULL DEFAULT 'GURU';
UPDATE "User" SET "role" = 'ADMIN' WHERE email = 'admin@mail.com';
