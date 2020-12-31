import yargslib from "yargs";
import url from "url";
import path from "path";

const envPath = path.resolve(process.cwd(), ".env.local");

export const command = "drop";
export const description = "Drop the database";

export const builder = (_yargs: yargslib.Argv<{}>) => {};

export const handler = async () => {
  require("dotenv").config({ path: envPath });

  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }

  /**
   * Note: this will need to be updated for other databases.
   * We assume pg is installed in the parent app.
   */
  dropPostgresDatabase(connectionString);
};

/**
 * Drops a postgres database. Useful for development
 * @param connectionString the database connection string
 */
export async function dropPostgresDatabase(connectionString: string) {
  const { auth: user, hostname: host, port, path: urlPath } = url.parse(
    connectionString
  );

  const { Client } = require("pg");
  const db = new Client({ user, host, port });
  const realUrlPath = urlPath?.slice(1);
  if (!realUrlPath) return;

  const dbName = realUrlPath.substring(0, realUrlPath.lastIndexOf("?"));

  await db.connect();
  console.log(`dropping the ${dbName} database`);

  try {
    await db.query(`DROP DATABASE "${dbName}"`);
  } catch (error) {
    console.log({ error });
  }

  await db.end();
}
