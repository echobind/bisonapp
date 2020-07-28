import React from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import {
  Link,
  Flex,
  Text,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Circle,
} from '@chakra-ui/core';

import { CenteredBoxForm } from '../components/CenteredBoxForm';

function LoginPage() {
  return (
    <>
      <Head>
        <title>LoginPage</title>
      </Head>

      <CenteredBoxForm>
        <Flex flexDirection="column" justifyContent="center" marginBottom={4}>
          <Circle size="60px" bg="gray.300" color="white" alignSelf="center" />

          <Text as="h2" color="gray.400" fontSize="lg" textAlign="center" marginTop={2}>
            Welcome Back!
          </Text>
        </Flex>

        <Stack spacing={4}>
          <FormControl id="email">
            <FormLabel>Email address</FormLabel>
            <Input type="email" />
          </FormControl>

          <FormControl id="password">
            <FormLabel>Password</FormLabel>
            <Input type="password" />
          </FormControl>
        </Stack>

        <Button marginTop={8} width="full">
          Login
        </Button>

        <Flex marginTop={2} justifyContent="flex-end">
          <Text color="gray.600" fontSize="sm">
            Forgot Password?
          </Text>
        </Flex>

        <Flex marginTop={8} justifyContent="center">
          <Text color="gray.500">
            New User?{' '}
            <NextLink href="/signup" passHref>
              <Link href="#" color="gray.900">
                Sign Up
              </Link>
            </NextLink>
          </Text>
        </Flex>
      </CenteredBoxForm>
    </>
  );
}

export default LoginPage;
