import React from 'react';
import { ChakraProvider, CSSReset } from '@chakra-ui/core';
import { ApolloProvider } from '@apollo/client';

import { MainLayout } from '../layouts/MainLayout';
import { createApolloClient } from '../lib/apolloClient';
import theme from '../chakra';

function App({ pageProps, Component }) {
  const apolloClient = createApolloClient();

  return (
    <ApolloProvider client={apolloClient}>
      <ChakraProvider theme={theme}>
        <CSSReset />

        <MainLayout>
          <Component {...pageProps} />
        </MainLayout>
      </ChakraProvider>
    </ApolloProvider>
  );
}

export default App;
