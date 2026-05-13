import { Pool } from 'pg'
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

async function main() {
  const client = await pool.connect()
  try {
    console.log('🔧 Adding Role enum and column...')

    // Create the enum type if not exists
    await client.query(`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'Role') THEN
          CREATE TYPE "Role" AS ENUM ('GURU', 'ADMIN');
        END IF;
      END $$;
    `)

    // Add column if not exists (default GURU)
    await client.query(`
      ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "role" "Role" NOT NULL DEFAULT 'GURU';
    `)

    // Update admin account
    const result = await client.query(`
      UPDATE "User" SET "role" = 'ADMIN' WHERE email = 'admin@mail.com';
    `)
    console.log(`✅ Role column added. Admin accounts updated: ${result.rowCount}`)
  } finally {
    client.release()
    await pool.end()
  }
}

main().catch(e => {
  console.error('❌ Migration failed:', e.message)
  process.exit(1)
})
