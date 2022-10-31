import { Session } from 'next-auth';
import { useSession } from 'next-auth/react';
import { ErrorBoundary } from 'react-error-boundary';

import React from 'react';
import type { AppProps as NextAppProps } from 'next/app';

import { AllProviders } from '@/components/AllProviders';
import { GenericError } from '@/components/errors/GenericError';
import { LoggedInLayout } from '@/layouts/LoggedIn';
import { LoggedOutLayout } from '@/layouts/LoggedOut';
// import '@fontsource/inter/variable.css';
import { trpc } from '@/utils/trpc';

type CustomAppProps = {
  cookies: string;
  session: Session;
};

export type AppProps = NextAppProps<CustomAppProps>;

/**
 * Renders a layout depending on the result of the useAuth hook
 */
function AppWithAuth({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();

  if (session) return <LoggedInLayout>{children}</LoggedInLayout>;

  return <LoggedOutLayout>{children}</LoggedOutLayout>;
}

function App({ pageProps, Component }: AppProps) {
  return (
    <AllProviders pageProps={pageProps}>
      <ErrorBoundary FallbackComponent={GenericError}>
        <AppWithAuth>
          <Component {...pageProps} />
        </AppWithAuth>
      </ErrorBoundary>
    </AllProviders>
  );
}

export default trpc.withTRPC(App);
