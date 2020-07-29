import React from 'react';
import { ChakraProvider, CSSReset } from '@chakra-ui/core';
import { ApolloProvider } from '@apollo/client';
import dynamic from 'next/dynamic';

import { AuthProvider, useAuth } from '../context/auth';
import { createApolloClient } from '../lib/apolloClient';
import theme from '../chakra';

/**
 * Dynamically load layouts. This codesplits and prevents code from the logged in layout from being
 * included in the bundle if we're rendering the logged out layout.
 */
const LoggedInLayout = dynamic(() =>
  import('../layouts/LoggedIn').then((mod) => mod.LoggedInLayout)
);

const LoggedOutLayout = dynamic(() =>
  import('../layouts/LoggedOut').then((mod) => mod.LoggedOutLayout)
);

/**
 * Renders a layout depending on the result of the useAuth hook
 */
function AppWithAuth({ children }) {
  const { user } = useAuth();

  return user ? (
    <LoggedInLayout>{children}</LoggedInLayout>
  ) : (
    <LoggedOutLayout>{children}</LoggedOutLayout>
  );
}

const apolloClient = createApolloClient();

function App({ pageProps, Component }) {
  return (
    <ApolloProvider client={apolloClient}>
      <ChakraProvider theme={theme}>
        <AuthProvider>
          <CSSReset />

          <AppWithAuth>
            <Component {...pageProps} />
          </AppWithAuth>
        </AuthProvider>
      </ChakraProvider>
    </ApolloProvider>
  );
}

export default App;
