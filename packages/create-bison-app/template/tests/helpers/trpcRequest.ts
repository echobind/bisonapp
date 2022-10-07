import { User } from '@prisma/client';

import { appRouter } from '@/server/routers/_app';
import { prisma } from '@/lib/prisma';

function createTestContext(user?: User) {
  return {
    db: prisma,
    prisma,
    user: user || null,
  };
}

/** A convenience method to call tRPC queries */
export const trpcRequest = (user?: Partial<User>) => {
  return appRouter.createCaller(createTestContext(user as User));
};
