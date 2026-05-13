import { Pool } from 'pg'
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

async function checkUsers() {
  try {
    const res = await pool.query('SELECT id, email, name FROM "User" LIMIT 5')
    console.log('Total Users Found:', res.rowCount)
    console.table(res.rows)
  } catch (err) {
    console.error('Error checking users:', err)
  } finally {
    await pool.end()
  }
}

checkUsers()
