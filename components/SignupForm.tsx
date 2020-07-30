import React from 'react';
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
// import { gql } from '@apollo/client';

// const SIGNUP_MUTATION = gql`
//   mutation SIGNUP($data: SignupInput!) {
//     signup(data: $data) {
//       token
//       user {
//         id
//       }
//     }
//   }
// `;

/** Form to sign up */
export function SignupForm() {
  return (
    <>
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
    </>
  );
}
