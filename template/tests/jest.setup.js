const util = require('util');
const childProcess = require('child_process');

const { nanoid } = require('nanoid');

const exec = util.promisify(childProcess.exec);

module.exports = async () => {
  // console.log(`\n[jest] waiting for server's health check...`);
  // let isUp = false;
  // while (isUp === false) {
  //   await new Promise((r) => setTimeout(r, 250));
  //   isUp = await statusCheck();
  // }
  // console.log(`[jest] server is up...`);

  global.schema = `test_${nanoid().toLowerCase()}`;
  global.databaseUrl = `postgresql://postgres:postgres@localhost:5432/testing?schema=${this.schema}`;

  process.env.DATABASE_URL = global.databaseUrl;
  global.process.env.DATABASE_URL = global.databaseUrl;

  // Run the migrations to ensure our schema has the required structure
  await exec(`yarn prisma migrate up --create-db --experimental`);
};
