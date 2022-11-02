import type { inferProcedureOutput } from '@trpc/server';
import superjson from 'superjson';
import { createTRPCNext } from '@trpc/next';
import { httpBatchLink } from '@trpc/client';

import type { AppRouter } from '@/server/routers/_app';

// exporting this so that we consistently use the same transformer everywhere.
export const transformer = superjson;

/**
 * A set of strongly-typed React hooks from your `AppRouter` type signature with `createReactQueryHooks`.
 * @link https://trpc.io/docs/react#3-create-trpc-hooks
 */
export const trpc = createTRPCNext<AppRouter>({
  config({ ctx }) {
    if (typeof window !== 'undefined') {
      // during client requests
      return {
        transformer,
        links: [
          httpBatchLink({
            url: '/api/trpc',
            maxURLLength: 2083, // a suitable size
          }),
        ],
      };
    }

    // during SSR below
    // optional: use SSG-caching for each rendered page (see caching section for more details)
    // const ONE_DAY_SECONDS = 60 * 60 * 24;
    // ctx?.res?.setHeader('Cache-Control', `s-maxage=1, stale-while-revalidate=${ONE_DAY_SECONDS}`);

    // The server needs to know your app's full url
    // On render.com you can use `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}/api/trpc`
    const url = process.env.RENDER_INTERNAL_HOSTNAME
      ? `https://${process.env.RENDER_INTERNAL_HOSTNAME}/api/trpc`
      : 'http://localhost:3000/api/trpc';

    return {
      transformer,
      links: [
        httpBatchLink({
          url,
          maxURLLength: 2083, // a suitable size
        }),
      ],
      /**
       * Set custom request headers on every request from tRPC
       * @link http://localhost:3000/docs/v10/header
       * @link http://localhost:3000/docs/v10/ssr
       */
      headers() {
        if (ctx?.req) {
          // To use SSR properly, you need to forward the client's headers to the server
          // This is so you can pass through things like cookies when we're server-side rendering
          // If you're using Node 18, omit the "connection" header
          const {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            connection: _connection,
            ...headers
          } = ctx.req.headers;

          return {
            ...headers,
            // Optional: inform server that it's an SSR request
            'x-ssr': '1',
          };
        }

        return {};
      },
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
