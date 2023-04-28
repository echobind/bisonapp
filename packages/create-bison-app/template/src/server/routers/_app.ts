/**
 * This file contains the root router of your tRPC-backend
 */

import { userRouter } from './user';

import { t } from '@/server/trpc';

/**
 * Create your application's root router
 * If you want to use SSG, you need export this
 * @link https://trpc.io/docs/ssg
 * @link https://trpc.io/docs/router
 */
export const appRouter = t.router({
  user: userRouter,
});

export type AppRouter = typeof appRouter;
