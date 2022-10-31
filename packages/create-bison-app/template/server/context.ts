import { getSession } from 'next-auth/react';

import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';

import { prisma } from '@/lib/prisma';

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export const createContext = async ({ req }: trpcNext.CreateNextContextOptions) => {
  const session = await getSession({ req });

  let user;

  // get all user props
  if (session?.user) {
    user = await prisma.user.findUnique({ where: { email: session?.user.email ?? undefined } });
  }

  // for API-response caching see https://trpc.io/docs/caching
  return {
    db: prisma,
    prisma,
    user,
  };
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
