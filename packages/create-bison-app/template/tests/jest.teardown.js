const { Client } = require('pg');

module.exports = async () => {
  // Drop the schema after the tests have completed
  const client = new Client({
    connectionString: global.databaseUrl.href,
  });

  await client.connect();
  await client.query(`DROP SCHEMA IF EXISTS "${global.schema}" CASCADE`);
  await client.end();
};
