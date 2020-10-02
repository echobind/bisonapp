export {};

const url = require('url');

const Client = require('pg').Client;

const connectionString = process.env.DATABASE_URL;

const dbUrl = url.parse(connectionString);

const db = new Client({
  user: dbUrl.auth,
  host: dbUrl.hostname,
  port: dbUrl.port,
});

const dbName = dbUrl.path.slice(1).substring(0, dbUrl.path.slice(1).lastIndexOf('?'));

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
