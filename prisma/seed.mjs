import { PrismaClient } from '../../src/generated/prisma/client.ts';
import bcrypt from 'bcryptjs';
import { readFileSync } from 'fs';
import { createRequire } from 'module';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱  Starting database seed...');

  const adminPwd = await bcrypt.hash('Admin@123', 12);
  await prisma.user.upsert({
    where: { email: 'admin@vitaminc.in' },
    update: {},
    create: { name: 'Admin', email: 'admin@vitaminc.in', password: adminPwd, role: 'MASTER_ADMIN' },
  });
  console.log('✅  Admin: admin@vitaminc.in / Admin@123');

  const creatorPwd = await bcrypt.hash('Creator@123', 12);
  await prisma.user.upsert({
    where: { email: 'editor@vitaminc.in' },
    update: {},
    create: { name: 'Editor', email: 'editor@vitaminc.in', password: creatorPwd, role: 'CONTENT_CREATOR' },
  });
  console.log('✅  Creator: editor@vitaminc.in / Creator@123');
}

main().then(() => prisma.$disconnect()).catch(e => { console.error(e); process.exit(1); });
