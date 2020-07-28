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
import { useForm } from 'react-hook-form';
import { useMutation, gql } from '@apollo/client';

const LOGIN_MUTATION = gql`
  mutation LOGIN($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`;

/** Form to Login */
export function LoginForm() {
  const { register, handleSubmit, errors, setError } = useForm();
  const [login] = useMutation(LOGIN_MUTATION);

  async function handleLogin(data) {
    try {
      const response = await login({ variables: data });
      console.log(response);
    } catch (e) {
      console.log('errors?', errors);
      setError('email', { type: 'manual', message: 'nooooo' });
      console.log(e.graphQLErrors);
      console.log(e.networkError);
      console.log(e.message);
      console.log(e.extraInfo);
    }

    // setError('email', { type: 'manual', message: 'nooooo' });
    // setError('password', { type: 'manual', message: 'nooooo' });
  }

  return (
    <form onSubmit={handleSubmit(handleLogin)}>
      <Flex flexDirection="column" justifyContent="center" marginBottom={4}>
        <Circle size="60px" bg="gray.300" color="white" alignSelf="center" />

        <Text as="h2" color="gray.400" fontSize="lg" textAlign="center" marginTop={2}>
          Welcome Back!
        </Text>
      </Flex>

      <Stack spacing={4}>
        <FormControl id="email">
          <FormLabel>Email address</FormLabel>
          <Input
            type="email"
            name="email"
            ref={register({ required: true })}
            isInvalid={errors.email}
          />
          {errors.email && errors.email.message}
        </FormControl>

        <FormControl id="password">
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            name="password"
            ref={register({ required: true })}
            isInvalid={errors.password}
          />
          {errors.password && errors.password.message}
        </FormControl>
      </Stack>

      <Button type="submit" marginTop={8} width="full">
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
    </form>
  );
}
