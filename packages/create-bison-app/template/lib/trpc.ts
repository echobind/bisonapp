import type { inferProcedureOutput } from '@trpc/server';
import superjson from 'superjson';
import { createTRPCNext } from '@trpc/next';
import { httpBatchLink } from '@trpc/client';

import { cookies } from './cookies';

import { LOGIN_TOKEN_KEY } from '@/constants';
import type { AppRouter } from '@/server/routers/_app';

// exporting this so that we consistently use the same transformer everywhere.
export const transformer = superjson;

/**
 * A set of strongly-typed React hooks from your `AppRouter` type signature with `createTRPCNext`.
 * @link https://trpc.io/docs/react#3-create-trpc-hooks
 */
export const trpc = createTRPCNext<AppRouter>({
  config({ ctx }) {
    let host: string;
    let protocol: string;
    let hostUrl = process.env.API_URL;

    if (ctx?.req) {
      host = ctx.req.headers['x-forwarded-host'] as string;
      protocol = (ctx.req.headers['x-forwarded-proto'] as string) || 'http';
      hostUrl = `${protocol}://${host}`;
    } else if (typeof window !== 'undefined' && typeof window.location !== 'undefined') {
      host = window.location.host;
      protocol = window.location.protocol;
      hostUrl = `${protocol}//${host}`;
    }

    const url = `${hostUrl}/api/trpc`;

    return {
      transformer,
      links: [
        httpBatchLink({
          url,
          maxURLLength: 2083, // a suitable size
          headers: () => {
            const token = cookies().get(LOGIN_TOKEN_KEY);
            return {
              authorization: token ? `Bearer ${token}` : '',
            };
          },
        }),
      ],
    };
  },
  ssr: false,
});

/**
 * This is a helper method to infer the output of a query resolver
 * @example type HelloOutput = inferQueryOutput<'hello'>
 */
export type inferQueryOutput<
  TRouteKey extends keyof AppRouter['_def']['procedures'],
  TProcedureKey extends keyof AppRouter['_def']['procedures'][TRouteKey]
> = inferProcedureOutput<AppRouter['_def']['procedures'][TRouteKey][TProcedureKey]>;
