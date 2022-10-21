import {
  ChakraProvider,
  cookieStorageManagerSSR,
  CSSReset,
  localStorageManager,
} from '@chakra-ui/react';
import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import defaultTheme from '../styles/theme';

import { AppProps } from '@/pages/_app';

type Props = {
  /** pageProps from pages/_app.tsx */
  pageProps: AppProps['pageProps'];
  children: ReactNode;
};

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
        {children}
      </SessionProvider>
    </ChakraProvider>
  );
}