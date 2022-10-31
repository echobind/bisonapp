import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { User } from '@prisma/client';

import { verifyAuthHeader } from '@/services/auth';
import { prisma } from '@/lib/prisma';

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export const createContext = async ({ req }: trpcNext.CreateNextContextOptions) => {
  const authHeader = verifyAuthHeader(req.headers.authorization);

  let user: User | null = null;

  // get all user props
  if (authHeader) {
    user = await prisma.user.findUnique({ where: { id: authHeader.userId } });
  }

  // for API-response caching see https://trpc.io/docs/caching
  return {
    db: prisma,
    prisma,
    user,
  };
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
