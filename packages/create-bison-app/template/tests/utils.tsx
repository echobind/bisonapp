import superjson from 'superjson';
import { createTRPCReact, loggerLink } from '@trpc/react-query';
import { useState } from 'react';
import '@testing-library/jest-dom';
import { render as defaultRender } from '@testing-library/react';
import { RouterContext } from 'next/dist/shared/lib/router-context';
import { NextRouter } from 'next/router';
import fetch from 'cross-fetch';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom/extend-expect';
import '@/tests/matchMedia.mock';

import { AllProviders } from '@/components/AllProviders';
import type { AppRouter } from '@/server/routers/_app';
import type { CustomAppProps } from '@/pages/_app';
export const transformer = superjson;

export const trpc = createTRPCReact<AppRouter>();

globalThis.fetch = fetch;

export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';

// const mockSession: Session = {
//   expires: new Date(Date.now() + 2 * 86400).toISOString(),
//   isAdmin: true,
//   user: {
//     roles: [Role.ADMIN],
//     email: 'peter@web.net',
//     profile: {
//       id: '1',
//       firstName: 'Peter',
//       lastName: 'Parker',
//       userId: '1',
//       image: null,
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     },
//   },
// };

// https://github.com/nextauthjs/next-auth/discussions/4185
// TODO: Should this be a helper util?
// jest.mock('next-auth/react', () => {
//   const originalModule = jest.requireActual('next-auth/react');

//   return {
//     __esModule: true,
//     ...originalModule,
//     useSession: jest.fn(() => {
//       return { data: mockSession, status: 'authenticated' }; // return type is [] in v3 but changed to {} in v4
//     }),
//   };
// });

/**
 * Overloads RTL's render function with our own. Adds a customizable mock for next/router.
 */
export function render(ui: RenderUI, { router = {}, ...options }: RenderOptions = {}) {
  return defaultRender(ui, {
    wrapper: function Wrapper({ children }) {
      const [queryClient] = useState(() => new QueryClient());

      const [trpcClient] = useState(() =>
        trpc.createClient({
          transformer,
          links: [loggerLink()],
        })
      );

      // Note: Session is null until mocked in test or logged in -- see above
      const ProviderPageProps: CustomAppProps = {
        cookies: 'string',
        session: null,
      };

      return (
        <RouterContext.Provider value={{ ...mockRouter, ...router }}>
          <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
              <AllProviders pageProps={ProviderPageProps}>{children}</AllProviders>
            </QueryClientProvider>
          </trpc.Provider>
        </RouterContext.Provider>
      );
    },
    ...options,
  });
}

const mockRouter: NextRouter = {
  basePath: '',
  pathname: '/',
  route: '/',
  asPath: '/',
  query: {},
  push: jest.fn(),
  replace: jest.fn(),
  reload: jest.fn(),
  back: jest.fn(),
  prefetch: jest.fn(() => Promise.resolve()),
  beforePopState: jest.fn(),
  events: {
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
  },
  isFallback: false,
  isLocaleDomain: false,
  isReady: false,
  isPreview: false,
};

type DefaultParams = Parameters<typeof defaultRender>;
type RenderUI = DefaultParams[0];
type RenderOptions = DefaultParams[1] & { router?: Partial<NextRouter> };
