import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

// Prisma v7 requires a driver adapter — we use @prisma/adapter-pg for PostgreSQL
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter } as any);

const DEFAULT_USERNAME = "admin";
const DEFAULT_PASSWORD = "password123"; // ⚠️ Change this immediately after first login!

async function main() {
  const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, 10);

  // upsert: create if not exists, skip update if already there
  const admin = await prisma.admin.upsert({
    where:  { username: DEFAULT_USERNAME },
    update: {},
    create: { username: DEFAULT_USERNAME, passwordHash },
  });

  console.log(`✅ Admin user ready: "${admin.username}"`);
  console.log(`⚠️  Default password is "${DEFAULT_PASSWORD}". Please change it!`);
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
