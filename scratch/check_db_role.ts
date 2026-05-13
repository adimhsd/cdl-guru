import { Pool } from 'pg'
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

async function main() {
  const client = await pool.connect()
  try {
    // Check if role column exists
    const colCheck = await client.query(`
      SELECT column_name, data_type, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'User' AND column_name = 'role'
    `)
    console.log('Column check (case sensitive):', colCheck.rows)

    // Try lowercase
    const colCheck2 = await client.query(`
      SELECT column_name, data_type, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'User'
    `)
    console.log('All columns in User table:', colCheck2.rows.map(r => r.column_name))

    // Check admin user role
    const adminUser = await client.query(`SELECT id, email, name, role FROM "User" WHERE email = 'admin@mail.com'`)
    console.log('Admin user:', adminUser.rows)

    // Check all roles
    const allRoles = await client.query(`SELECT email, role FROM "User" ORDER BY email LIMIT 5`)
    console.log('Sample roles:', allRoles.rows)

  } finally {
    client.release()
    await pool.end()
  }
}

main().catch(e => {
  console.error('Check failed:', e.message)
})
