import { Session } from 'next-auth';
import React from 'react';
import type { AppProps as NextAppProps } from 'next/app';

import { AllProviders } from '@/components/AllProviders';
// import '@fontsource/inter/variable.css';
import { trpc } from '@/utils/trpc';

export type CustomAppProps = {
  cookies: string;
  session: Session | null | undefined; // Account for anonymous first time users
};

export type AppProps = NextAppProps<CustomAppProps>;

function App({ pageProps, Component }: AppProps) {
  return (
    <AllProviders pageProps={pageProps}>
      <Component {...pageProps} />
    </AllProviders>
  );
}

export default trpc.withTRPC(App);
