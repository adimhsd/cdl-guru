import { Pool } from 'pg'
import bcrypt from 'bcryptjs'
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

async function testPassword() {
  try {
    const email = 'guru1@mail.com'
    const attempt = 'guru1'
    
    const res = await pool.query('SELECT password FROM "User" WHERE email = $1', [email])
    if (res.rowCount === 0) {
      console.log('User not found')
      return
    }
    
    const hash = res.rows[0].password
    console.log('Hashed password from DB:', hash)
    
    const match = await bcrypt.compare(attempt, hash)
    console.log('Bcrypt comparison result for "guru1":', match)
    
  } catch (err) {
    console.error('Error:', err)
  } finally {
    await pool.end()
  }
}

testPassword()
