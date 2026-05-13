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
  const count = await prisma.interaction.count({
    where: { userId: user.id }
  });
  console.log('Interaction Count:', count);
}

check().finally(async () => {
  await prisma.$disconnect();
  await pool.end();
});
