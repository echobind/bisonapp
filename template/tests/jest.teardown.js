const util = require('util');
const childProcess = require('child_process');

const { Client } = require('pg');
const NodeEnvironment = require('jest-environment-node');
const { nanoid } = require('nanoid');

const exec = util.promisify(childProcess.exec);

module.exports = async () => {
  // Drop the schema after the tests have completed
  const client = new Client({
    connectionString: global.databaseUrl.href,
  });

  await client.connect();
  await client.query(`DROP SCHEMA IF EXISTS "${global.schema}" CASCADE`);
  await client.end();

  // TODO: kill the dev server?
};
