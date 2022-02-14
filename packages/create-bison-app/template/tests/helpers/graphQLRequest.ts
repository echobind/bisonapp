import request from 'supertest';
import { User } from '@prisma/client';

import server, { GRAPHQL_PATH } from '@/pages/api/graphql';
import { appJwtForUser } from '@/services/auth';
import { disconnect } from '@/lib/prisma';

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

interface GraphQLRequestOptions {
  query?: string;
  variables?: Record<string, any>;
}
