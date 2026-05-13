import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
import { Client } from 'pg'

async function test() {
  const client = new Client({ connectionString: process.env.DATABASE_URL })
  try {
    await client.connect()
    const res = await client.query('SELECT COUNT(*) FROM "User"')
    console.log('User count:', res.rows[0].count)
    await client.end()
  } catch (e) {
    console.error('Connection failed:', e)
  }
}

test()
