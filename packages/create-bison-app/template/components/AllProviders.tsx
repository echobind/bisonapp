import { ReactNode } from 'react';
import { ChakraProvider, CSSReset } from '@chakra-ui/react';
import { Dict } from '@chakra-ui/utils';

import { AuthProvider } from '@/context/auth';
import defaultTheme from '@/chakra';

interface Props {
  children: ReactNode;
  theme?: Dict<any>;
}

/**
 * Renders all context providers
 */
export function AllProviders({ theme = defaultTheme, children }: Props) {
  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <CSSReset />

        {children}
      </AuthProvider>
    </ChakraProvider>
  );
}
