import '@testing-library/jest-dom';
import React from 'react';
import { render as defaultRender } from '@testing-library/react';
// import { MockedProvider, MockedResponse } from '@apollo/react-testing';
import { RouterContext } from 'next/dist/shared/lib/router-context';
import { NextRouter } from 'next/router';
import '@testing-library/jest-dom/extend-expect';

import { AllProviders } from '@/components/AllProviders';
// import { ME_QUERY } from '@/context/auth';
// import { User } from '@/types';

export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';

/**
 * Overloads RTL's render function with our own. Adds a customizable mock for next/router.
 */
export function render(ui: RenderUI, { router = {}, ...options }: RenderOptions = {}) {
  return defaultRender(ui, {
    wrapper: ({ children }) => {
      return (
        <RouterContext.Provider value={{ ...mockRouter, ...router }}>
          <AllProviders>{children}</AllProviders>
        </RouterContext.Provider>
      );
    },
    ...options,
  });
}

// const createUserMock = (user?: Partial<User>) => {
//   return {
//     request: {
//       query: ME_QUERY,
//     },
//     result: {
//       data: {
//         me: user || null,
//       },
//     },
//   };
// };

/**
 * Returns a mock apollo provider, with an optional logged in user for convenience
 * @param currentUser if passed, automatically creates a mock for the user
 * @param apolloMocks Mocks for Apollo
 * @param router Optional router context
 * @param children
 */
// export const WithMockedTestState = (props: WithMockedTestStateProps) => {
//   const { currentUser, apolloMocks = [], children, router } = props;
//   const userMock: MockedResponse = createUserMock(currentUser);
//   const mocks = [userMock, ...apolloMocks];
//   const routerProviderValue = { ...mockRouter, ...router } as NextRouter;

//   // addTypename={false} is required if using fragments
//   return (
//     <MockedProvider mocks={mocks} addTypename={false}>
//       <RouterContext.Provider value={routerProviderValue}>{children}</RouterContext.Provider>
//     </MockedProvider>
//   );
// };

// interface WithMockedTestStateProps {
//   currentUser?: Partial<User>;
//   apolloMocks?: MockedResponse[];
//   router?: Partial<NextRouter>;
//   children?: any;
// }

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
