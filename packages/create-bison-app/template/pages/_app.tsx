import React from 'react';
import { NextComponentType } from 'next';
import { AppProps as NextAppProps } from 'next/app';
import dynamic from 'next/dynamic';

import { AllProviders } from '../components/AllProviders';
import { useAuth } from '../context/auth';

export type BisonComponentType = NextComponentType & {
  getLayout?: (page: () => React.ReactNode) => React.ReactNode;
};

export type BisonAppProps = NextAppProps & {
  Component: BisonComponentType;
};

/**
 * Dynamically load layouts. This codesplits and prevents code from the logged in layout from being
 * included in the bundle if we're rendering the logged out layout.
 */
const LoggedInLayout = dynamic<{ children: React.ReactNode }>(() =>
  import('../layouts/LoggedIn').then((mod) => mod.LoggedInLayout)
);

const LoggedOutLayout = dynamic<{ children: React.ReactNode }>(() =>
  import('../layouts/LoggedOut').then((mod) => mod.LoggedOutLayout)
);

/**
 * Renders a layout depending on the result of the useAuth hook
 */
function AppWithAuth({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  return user ? (
    <LoggedInLayout>{children}</LoggedInLayout>
  ) : (
    <LoggedOutLayout>{children}</LoggedOutLayout>
  );
}

function App({ pageProps, Component }: BisonAppProps) {
  // Look for a static getLayout method on the component, and use it if it exists. This allows us to have
  //  persistent elements on the page that don't re-render as we navigate if they don't need to.
  const getLayout = Component.getLayout || ((page: any) => page);

  return (
    <AllProviders>
      <AppWithAuth>{getLayout(<Component {...pageProps} />)}</AppWithAuth>
    </AllProviders>
  );
}

export default App;
