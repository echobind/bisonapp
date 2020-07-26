import { User } from '@prisma/client';
import request from 'supertest';
import { Client } from 'pg';

import { GRAPHQL_PATH } from '../graphql/schema';
import server from '../pages/api/graphql';
import { appJwtForUser } from '../services/auth';
import { prisma, connect, disconnect } from '../lib/prisma';

// reexport prisma methods
export { prisma, connect, disconnect };

/** A convenience method to call graphQL queries */
export const graphQLRequest = async (options: GraphQLRequestOptions): Promise<any> => {
  const response = await request(server)
    .post(GRAPHQL_PATH)
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .send(options);

  await disconnect();

  return response;
};

/** A convenience method to call graphQL queries as a specific user */
export const graphQLRequestAsUser = async (
  user: Partial<User>,
  options: GraphQLRequestOptions
): Promise<any> => {
  const token = appJwtForUser(user);

  const response = await request(server)
    .post(GRAPHQL_PATH)
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${token}`)
    .send(options);

  await disconnect();

  return response;
};

/**
 * Resets a database to a blank state.
 * Truncates all tables except for _Migrations
 */
export const resetDB = async (): Promise<void> => {
  const schema = process.env.DATABASE_URL.match(/schema=(.*)$/)[1];

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
};

interface GraphQLRequestOptions {
  query?: string;
  variables?: Record<string, any>;
}
