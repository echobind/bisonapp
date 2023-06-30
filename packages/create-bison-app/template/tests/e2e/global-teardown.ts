import { FullConfig } from '@playwright/test';

import { prisma } from '@/lib/prisma';
import { getSchema } from '~/tests/helpers/db';
import { config } from '~/src/env.mjs';

async function globalTeardown(_config: FullConfig) {
  const schema = getSchema(config.database.url);

  prisma.$executeRaw`DROP SCHEMA ${schema} CASCADE`;
  prisma.$executeRaw`CREATE SCHEMA ${schema}`;
}

export default globalTeardown;
