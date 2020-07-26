import React from 'react';
import { ChakraProvider, CSSReset } from '@chakra-ui/core';

import { MainLayout } from '../layouts/MainLayout';
import theme from '../chakra';

function App({ pageProps, Component }) {
  return (
    <ChakraProvider theme={theme}>
      <CSSReset />

      <MainLayout>
        <Component {...pageProps} />
      </MainLayout>
    </ChakraProvider>
  );
}

export default App;
