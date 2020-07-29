import React from 'react';
import { ChakraProvider, CSSReset } from '@chakra-ui/core';
import { ApolloProvider } from '@apollo/client';

import { AuthProvider, useAuth } from '../context/auth';
import { LoggedInLayout } from '../layouts/LoggedIn';
import { LoggedOutLayout } from '../layouts/LoggedOut';
import { createApolloClient } from '../lib/apolloClient';
import theme from '../chakra';

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
