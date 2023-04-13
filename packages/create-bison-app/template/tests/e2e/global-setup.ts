import { promisify } from 'util';
import childProcess from 'child_process';

import { FullConfig } from '@playwright/test';

const exec = promisify(childProcess.exec);

async function globalSetup(_config: FullConfig) {
  // Run the migrations to ensure our schema has the required structure
  await exec('yarn prisma migrate deploy', { env: process.env });
}

export default globalSetup;
