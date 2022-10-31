import '@testing-library/jest-dom';
import { render as defaultRender } from '@testing-library/react';
import { RouterContext } from 'next/dist/shared/lib/router-context';
import { NextRouter } from 'next/router';
import fetch from 'cross-fetch';
import { createTRPCReact, loggerLink } from '@trpc/react-query';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import '@testing-library/jest-dom/extend-expect';

import { AllProviders } from '@/components/AllProviders';
import type { AppRouter } from '@/server/routers/_app';

export const trpc = createTRPCReact<AppRouter>();

globalThis.fetch = fetch;

export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';

/**
 * Overloads RTL's render function with our own. Adds a customizable mock for next/router.
 */
export function render(ui: RenderUI, { router = {}, ...options }: RenderOptions = {}) {
  return defaultRender(ui, {
    wrapper: function Wrapper({ children }) {
      const [queryClient] = useState(() => new QueryClient());

      const [trpcClient] = useState(() =>
        trpc.createClient({
          links: [loggerLink()],
        })
      );

      return (
        <RouterContext.Provider value={{ ...mockRouter, ...router }}>
          <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
              <AllProviders>{children}</AllProviders>
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
