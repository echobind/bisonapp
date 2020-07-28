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

function SignupPage() {
  return (
    <>
      <Head>
        <title>Signup Page</title>
      </Head>

      <CenteredBoxForm>
        <Flex flexDirection="column" justifyContent="center" marginBottom={4}>
          <Circle size="60px" bg="gray.300" color="white" alignSelf="center" />

          <Text as="h2" color="gray.400" fontSize="lg" textAlign="center" marginTop={2}>
            Create an account.
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

          <FormControl id="firstName">
            <FormLabel>First Name</FormLabel>
            <Input type="text" />
          </FormControl>

          <FormControl id="lastName">
            <FormLabel>Last Name</FormLabel>
            <Input type="text" />
          </FormControl>
        </Stack>

        <Button marginTop={8} width="full">
          Signup
        </Button>

        <Flex marginTop={8} justifyContent="center">
          <Text color="gray.500">
            Have an account?{' '}
            <NextLink href="/login" passHref>
              <Link href="#" color="gray.900">
                Sign In
              </Link>
            </NextLink>
          </Text>
        </Flex>
      </CenteredBoxForm>
    </>
  );
}

export default SignupPage;
