import React from 'react';
import { ApolloClient, ApolloProvider, NormalizedCacheObject } from '@apollo/client';
import { ChakraProvider, CSSReset } from '@chakra-ui/react';
import { Dict } from '@chakra-ui/utils';

import { AuthProvider } from '@/context/auth';
import { createApolloClient } from '@/lib/apolloClient';
import defaultTheme from '@/chakra';

interface Props {
  apolloClient?: ApolloClient<NormalizedCacheObject>;
  children: React.ReactNode;
  theme?: Dict<any>;
}

const defaultApolloClient = createApolloClient();

/**
 * Renders all context providers
 */
export function AllProviders({
  apolloClient = defaultApolloClient,
  theme = defaultTheme,
  children,
}: Props) {
  return (
    <ApolloProvider client={apolloClient}>
      <ChakraProvider theme={theme}>
        <AuthProvider>
          <CSSReset />

          {children}
        </AuthProvider>
      </ChakraProvider>
    </ApolloProvider>
  );
}
