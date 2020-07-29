import React from 'react';
import { useRouter } from 'next/router';
import { Box, Center, Flex, Text, Button } from '@chakra-ui/core';

import { Logo } from '../components/Logo';
import { Nav } from '../components/Nav';
import { useAuth } from '../context/auth';

export function LoggedInLayout({ children }) {
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

      <Center as="footer" mt="auto" py={4}>
        <Flex flexDirection="column" alignItems="center">
          <Logo />
          <Text as="i" textAlign="center">
            Copyright Ⓒ 2020{' '}
            <a href="https://echobind.com" target="_blank" rel="noopener noreferrer">
              Echobind LLC.
            </a>{' '}
            All rights reserved.
          </Text>
        </Flex>
      </Center>
    </Flex>
  );
}
