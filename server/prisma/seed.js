import 'dotenv/config';
import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import { PrismaPg } from '@prisma/adapter-pg';
import pg2 from 'pg';
import bcrypt from 'bcryptjs';

const pool = new pg2.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const passwordHash = await bcrypt.hash('password123', 10);

  // 1. Create Super Admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@school.com' },
    update: {},
    create: {
      email: 'admin@school.com',
      name: 'Super Admin',
      passwordHash,
      role: 'SUPERADMIN',
    },
  });

  // 2. Create Teacher
  const teacherUser = await prisma.user.upsert({
    where: { email: 'teacher@school.com' },
    update: {},
    create: {
      email: 'teacher@school.com',
      name: 'John Teacher',
      passwordHash,
      role: 'TEACHER',
      teacherProfile: {
        create: {
          subjects: ['Math', 'Science'],
        },
      },
    },
  });

  // 3. Create Parent
  const parentUser = await prisma.user.upsert({
    where: { email: 'parent@school.com' },
    update: {},
    create: {
      email: 'parent@school.com',
      name: 'Jane Parent',
      passwordHash,
      role: 'PARENT',
      parentProfile: {
        create: {},
      },
    },
  });

  // Fetch the created parent profile to link student
  const parentProfile = await prisma.parent.findUnique({
    where: { userId: parentUser.id },
  });

  // 4. Create Student
  const studentUser = await prisma.user.upsert({
    where: { email: 'student@school.com' },
    update: {},
    create: {
      email: 'student@school.com',
      name: 'Timmy Student',
      passwordHash,
      role: 'STUDENT',
      studentProfile: {
        create: {
          grade: '10th',
          section: 'A',
          rollNo: '101',
          parentId: parentProfile.id,
        },
      },
    },
  });

  console.log({ admin, teacherUser, parentUser, studentUser });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
