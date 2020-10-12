export {};

// eslint-disable-next-line
const url = require('url');

const Client = require('pg').Client;

const connectionString = process.env.DATABASE_URL;
const { auth: user, hostname: host, port, path } = url.parse(connectionString);
const db = new Client({ user, host, port });
const dbName = path.slice(1).substring(0, path.slice(1).lastIndexOf('?'));

async function drop() {
  await db.connect();
  console.log(`dropping the ${dbName} database`);

  try {
    await db.query(`DROP DATABASE "${dbName}"`);
  } catch (error) {
    console.log({ error });
  }

  await db.end();
}

drop();
