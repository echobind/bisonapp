import { IncomingMessage } from 'http';

import { Context as ApolloContext } from 'apollo-server-core';
import { PrismaClient, User } from '@prisma/client';

import { prisma } from '@/lib/prisma';
import { verifyAuthHeader } from '@/services/auth';

/**
 * Populates a context object for use in resolvers.
 * If there is a valid auth token in the authorization header, it will add the user to the context
 * @param context context from apollo server
 */
export async function createContext(context: ApolloApiContext): Promise<Context> {
  const authHeader = verifyAuthHeader(context.req.headers.authorization);
  let user: User | null = null;

  if (authHeader) {
    user = await prisma.user.findUnique({ where: { id: authHeader.userId } });
  }

  return {
    db: prisma,
    prisma,
    user,
  };
}

type ApolloApiContext = ApolloContext<{ req: IncomingMessage }>;

export type Context = {
  db: PrismaClient;
  prisma: PrismaClient;
  user: User | null;
};
