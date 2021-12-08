import React from 'react';
import { Box, Flex, Button } from '@chakra-ui/react';

import { Link } from '../components/Link';
import { Logo } from '../components/Logo';
import { Footer } from '../components/Footer';

interface Props {
  children: React.ReactNode;
}

export function LoggedOutLayout({ children }: Props) {
  return (
    <Flex direction="column" minH="100vh">
      <>
        <Flex p={4}>
          <Logo />

          <Button as={Link} href="/login" ml="auto" display={{ base: 'none', lg: 'inline-flex' }}>
            Login
          </Button>
        </Flex>
      </>

      <Box flex="1 1 auto" mt={8}>
        {children}
      </Box>

      <Footer />
    </Flex>
  );
}
