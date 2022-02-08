import {
  ApolloServerPluginCacheControl,
  ApolloServerPluginLandingPageGraphQLPlayground,
  ApolloServerPluginLandingPageDisabled,
} from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-micro';
import type { NextApiRequest, NextApiResponse } from 'next';

import { createContext } from '@/graphql/context';
import { schema } from '@/graphql/schema';

export const GRAPHQL_PATH = '/api/graphql';

// this config block is REQUIRED on Vercel! It stops the body of incoming HTTP requests from being parsed
export const config = {
  api: {
    bodyParser: false,
  },
};

export const server = new ApolloServer({
  schema,
  introspection: true,
  context: createContext,
  plugins: [
    process.env.NODE_ENV === 'production'
      ? ApolloServerPluginLandingPageDisabled()
      : ApolloServerPluginLandingPageGraphQLPlayground(),
    ApolloServerPluginCacheControl({
      calculateHttpHeaders: false,
    }),
  ],
});

const serverStart = server.start();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await serverStart;

  return server.createHandler({ path: GRAPHQL_PATH })(req, res);
}
