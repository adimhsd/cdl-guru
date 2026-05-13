import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const connectionString = "postgresql://postgres:postgres@localhost:5432/cdl_db";

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function check() {
  const user = await prisma.user.findUnique({ where: { email: 'guru1@mail.com' } });
  if (!user) {
    console.log('User not found');
    return;
  }
  const results = await prisma.testResult.findMany({
    where: { userId: user.id, type: 'POST_TEST' }
  });
  console.log('Results:', JSON.stringify(results, null, 2));
}

check().finally(async () => {
  await prisma.$disconnect();
  await pool.end();
});
