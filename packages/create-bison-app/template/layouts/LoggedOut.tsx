import React from 'react';
import { Box, Flex } from '@chakra-ui/react';

import { ButtonLink } from '@/components/Link';
import { Logo } from '@/components/Logo';
import { Footer } from '@/components/Footer';

interface Props {
  children: React.ReactNode;
}

export function LoggedOutLayout({ children }: Props) {
  return (
    <Flex direction="column" minH="100vh">
      <>
        <Flex p={4}>
          <Logo />

          <ButtonLink href="/login" ml="auto" display={{ base: 'none', lg: 'inline-flex' }}>
            Login
          </ButtonLink>
        </Flex>
      </>

      <Box flex="1 1 auto" mt={8}>
        {children}
      </Box>

      <Footer />
    </Flex>
  );
}
