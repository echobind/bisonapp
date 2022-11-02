import { TRPCError } from '@trpc/server';

import { t } from '@/server/trpc';
import { isAdmin } from '@/services/permissions';

const authMiddleware = t.middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  return next({
    ctx: {
      ...ctx,
      // infers that `user` is non-nullable to downstream procedures
      user: ctx.user,
    },
  });
});

const adminMiddleware = t.middleware(({ ctx, next }) => {
  if (!isAdmin(ctx.user)) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  return next({
    ctx: {
      ...ctx,
      // infers that `user` is non-nullable to downstream procedures
      user: ctx.user,
    },
  });
});

export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(authMiddleware);
export const adminProcedure = t.procedure.use(adminMiddleware);
