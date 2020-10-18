export {};
const spawn = require('child_process').spawn;

const bisonConfig = require('../package.json').bison;
const DEFAULT_BUILD_COMMAND = `yarn build:nexus && yarn build:prisma && yarn build:next`;

/**
 * This builds the production app.
 * if the current branch should be migrated, it runs migrations first.
 */
function buildProd() {
  const { staging, production } = bisonConfig.branches;
  const branchesToMigrate = new RegExp(`${staging}|${production}`);
  const currentBranch = process.env.BRANCH || process.env.VERCEL_GITHUB_COMMIT_REF;
  const shouldMigrate = branchesToMigrate.test(currentBranch);

  console.log('--------------------------------------------------------------');
  console.log('Determining if we should migrate the database...');
  console.log('branches to migrate:', branchesToMigrate);
  console.log('current branch name:', currentBranch || '(unknown)');
  console.log(shouldMigrate ? `${currentBranch} detected. Migrating.` : `Not running migrations.`);
  console.log('--------------------------------------------------------------');

  let buildCommand = DEFAULT_BUILD_COMMAND;

  if (shouldMigrate) {
    buildCommand = `yarn db:migrate && ${buildCommand}`;
  }

  const child = spawn(buildCommand, {
    shell: true,
    stdio: 'inherit',
  });

  child.on('exit', function (code) {
    process.exit(code);
  });
}

if (require.main === module) {
  buildProd();
}

module.exports = { buildProd };
