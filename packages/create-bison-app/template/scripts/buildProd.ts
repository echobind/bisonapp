import { spawn } from 'child_process';
import { config } from '@/config';

const DEFAULT_BUILD_COMMAND = `yarn build:prisma && yarn build:next`;

const buildCommand = config.database.shouldMigrate
  ? `yarn db:deploy && ${DEFAULT_BUILD_COMMAND}`
  : DEFAULT_BUILD_COMMAND;

const child = spawn(buildCommand, {
  shell: true,
  stdio: 'inherit',
});

child.on('exit', function (code: number) {
  process.exit(code);
});
