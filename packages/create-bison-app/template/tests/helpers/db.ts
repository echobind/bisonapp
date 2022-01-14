import childProcess from 'child_process';
import util from 'util';

import { Client } from 'pg';

const exec = util.promisify(childProcess.exec);

/**
 * Resets a database to a blank state.
 * Truncates all tables except for _Migrations
 */
export const resetDB = async (): Promise<boolean> => {
  if (process.env.NODE_ENV === 'production') return Promise.resolve(false);

  const match = process.env.DATABASE_URL?.match(/schema=(.*)(&.*)*$/);
  const schema = match ? match[1] : 'public';

  // NOTE: the prisma client does not handle this query well, use pg instead
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  await client.connect();
  await client.query(`DO
    $func$
    BEGIN
      EXECUTE
      (SELECT 'TRUNCATE TABLE ' || string_agg(oid::regclass::text, ', ') || ' CASCADE'
        FROM   pg_class
        WHERE  relkind = 'r'  -- only tables
        AND    relname != '_Migration'
        AND    relnamespace = '${schema}'::regnamespace
      );
    END
    $func$;`);

  await client.end();

  return true;
};

/**
 * Sets up a test database. Assumes DATABASE_URL is set properly.
 */
export const setupDB = async (): Promise<boolean> => {
  // ensure the db is created and migrated
  await exec(`yarn prisma migrate reset --force`);

  return true;
};
