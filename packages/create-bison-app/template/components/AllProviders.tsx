import { SessionProvider, useSession } from 'next-auth/react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ErrorBoundary } from 'react-error-boundary';
import { ReactNode } from 'react';
import {
  ChakraProvider,
  cookieStorageManagerSSR,
  CSSReset,
  localStorageManager,
} from '@chakra-ui/react';

import defaultTheme from '../styles/theme';

import { GenericError } from './errors/GenericError';

import { LoggedInLayout } from '@/layouts/LoggedIn';
import { LoggedOutLayout } from '@/layouts/LoggedOut';
import { AppProps } from '@/pages/_app';

type Props = {
  /** pageProps from pages/_app.tsx */
  pageProps?: AppProps['pageProps'];
  children: ReactNode;
};

/**
 * Renders a layout depending on the result of the useAuth hook
 */
function AppWithAuth({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();

  if (session?.user) return <LoggedInLayout>{children}</LoggedInLayout>;

  return <LoggedOutLayout>{children}</LoggedOutLayout>;
}

/**
 * Renders all context providers
 */
export function AllProviders({ pageProps, children }: Props) {
  const { cookies, session } = pageProps;

  const colorModeManager =
    typeof cookies === 'string' ? cookieStorageManagerSSR(cookies) : localStorageManager;

  return (
    <ChakraProvider theme={defaultTheme} colorModeManager={colorModeManager}>
      <ReactQueryDevtools initialIsOpen={false} />
      <SessionProvider session={session}>
        <CSSReset />
        <ErrorBoundary FallbackComponent={GenericError}>
          <AppWithAuth>{children}</AppWithAuth>
        </ErrorBoundary>
      </SessionProvider>
    </ChakraProvider>
  );
}
