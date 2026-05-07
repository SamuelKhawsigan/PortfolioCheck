import "dotenv/config";
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

/**
 * Creates a new Prisma client using the @prisma/adapter-pg driver adapter.
 * This is required for Prisma v7+, which no longer manages the DB connection
 * internally — you must pass a driver adapter explicitly.
 */
function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is not set.");
  }

  // PrismaPg directly accepts a connection string in Prisma v7
  const adapter = new PrismaPg({ connectionString });

  return new PrismaClient({ adapter } as any);
}

// --- Singleton Pattern for Next.js ---
// In development, Next.js hot-reloads modules which would create a new
// PrismaClient on every reload. We cache the instance on the global object
// to prevent exhausting the database connection limit.

declare global {
  // eslint-disable-next-line no-var
  var prisma: ReturnType<typeof createPrismaClient> | undefined;
}

const prisma = globalThis.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}

export default prisma;
