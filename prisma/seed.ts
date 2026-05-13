import bcrypt from 'bcryptjs'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  console.error('❌ DATABASE_URL not found in .env.local')
  process.exit(1)
}

// Initialize with adapter-pg
const pool = new Pool({ connectionString: databaseUrl })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  const adminPassword = await bcrypt.hash('admin123', 10)

  console.log('🌱 Seeding database with 20 Guru & 1 Admin...')

  // Seed 20 Guru accounts
  for (let i = 1; i <= 20; i++) {
    const email = `guru${i}@mail.com`
    const password = await bcrypt.hash(`guru${i}`, 10)
    
    await prisma.user.upsert({
      where: { email },
      update: { name: `Guru ${i}` },
      create: {
        email,
        name: `Guru ${i}`,
        password,
      },
    })
    if (i % 5 === 0) process.stdout.write(`${i} `)
  }

  // Seed Admin
  await prisma.user.upsert({
    where: { email: 'admin@mail.com' },
    update: { name: 'Administrator' },
    create: {
      email: 'admin@mail.com',
      name: 'Administrator',
      password: adminPassword,
    },
  })

  console.log('\n✅ Seed success!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e.message)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end()
  })
