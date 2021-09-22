export {};
const spawn = require('child_process').spawn;

const DEFAULT_BUILD_COMMAND = `yarn build:types && yarn build:next`;

/**
 * This builds the production app.
 * if the current branch should be migrated, it runs migrations first.
 */
function buildProd() {
  let buildCommand = DEFAULT_BUILD_COMMAND;
  const shouldMigrate = process.env.NODE_ENV === 'production';

  if (shouldMigrate) {
    buildCommand = `yarn db:deploy && ${buildCommand}`;
  }

  const child = spawn(buildCommand, {
    shell: true,
    stdio: 'inherit',
  });

  child.on('exit', function (code: number) {
    process.exit(code);
  });
}

if (require.main === module) {
  buildProd();
}

module.exports = { buildProd };
