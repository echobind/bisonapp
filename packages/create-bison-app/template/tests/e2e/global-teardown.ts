import { FullConfig } from '@playwright/test';

import { prisma } from '@/lib/prisma';

async function globalTeardown(_config: FullConfig) {
  prisma.$executeRaw`DROP SCHEMA public CASCADE`;
  prisma.$executeRaw`CREATE SCHEMA public`;
}

export default globalTeardown;
