import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  const email = 'guru1@mail.com'
  const password = 'guru1'

  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user) {
    console.log('USER NOT FOUND')
    return
  }

  console.log('USER FOUND:', user.email, user.name)

  const valid = await bcrypt.compare(password, user.password)
  console.log('PASSWORD VALID:', valid)
}

main().finally(() => prisma.$disconnect())
