import React, { useState } from 'react';
import { useRouter } from 'next/router';
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

import { useAuth } from '../context/auth';
import { setErrorsFromGraphQLErrors } from '../utils/setErrors';

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
  const [isLoading, setIsLoading] = useState(false);
  const [login] = useMutation(LOGIN_MUTATION);
  const { login: loginUser } = useAuth();
  const router = useRouter();

  /**
   * Submits the login form
   * @param formData the data passed from the form hook
   */
  async function handleLogin(formData) {
    try {
      setIsLoading(true);
      const { data } = await login({ variables: formData });

      await loginUser(data.login.token);

      router.replace('/');
    } catch (e) {
      setErrorsFromGraphQLErrors(setError, e.graphQLErrors || []);
    } finally {
      setIsLoading(false);
    }
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

      <Button type="submit" marginTop={8} width="full" isLoading={isLoading}>
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
