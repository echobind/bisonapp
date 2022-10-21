import { Prisma, PrismaClient } from '@prisma/client';

/**
 * Instantiate prisma client for Next.js:
 * https://www.prisma.io/docs/support/help-articles/nextjs-prisma-client-dev-practices#solution
 */

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Set default prisma logs. More logs in debug mode.
const logOptions: Prisma.LogLevel[] = process.env.DEBUG ? ['query', 'error'] : ['error'];

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: logOptions,
  });

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export async function disconnect() {
  await prisma.$disconnect();

  return true;
}

export async function connect() {
  await prisma.$connect();

  return true;
}
