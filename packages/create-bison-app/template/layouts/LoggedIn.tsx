import React from 'react';
import { useRouter } from 'next/router';
import { Box, Flex, Button } from '@chakra-ui/react';

import { Logo } from '@/components/Logo';
import { Nav } from '@/components/Nav';
import { useAuth } from '@/context/auth';
import { Footer } from '@/components/Footer';

interface Props {
  children: React.ReactNode;
}

export function LoggedInLayout({ children }: Props) {
  const { logout } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    logout();

    await router.replace('/login');
  }

  return (
    <Flex direction="column" minH="100vh">
      <>
        <Flex p={4}>
          <Logo />

          <Nav />

          <Button
            as="a"
            ml={16}
            display={{ base: 'none', lg: 'inline-flex' }}
            onClick={handleLogout}
          >
            Logout
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
