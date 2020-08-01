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
import { gql } from '@apollo/client';

import { EMAIL_REGEX } from '../constants';
import { useAuth } from '../context/auth';
import { ErrorText } from '../components/ErrorText';
import { setErrorsFromGraphQLErrors } from '../utils/setErrors';
import { useLoginMutation } from '../types';

export const LOGIN_MUTATION = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`;

/** Form to Login */
export function LoginForm() {
  const { register, handleSubmit, errors, setError } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [login] = useLoginMutation();
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
      await router.replace('/');
    } catch (e) {
      setErrorsFromGraphQLErrors(setError, e.graphQLErrors);
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
          <FormLabel htmlFor="email">Email address</FormLabel>
          <Input
            type="text"
            name="email"
            ref={register({
              required: 'email is required',
              pattern: {
                value: EMAIL_REGEX,
                message: 'invalid email',
              },
            })}
            isInvalid={errors.email}
          />
          <ErrorText>{errors.email && errors.email.message}</ErrorText>
        </FormControl>

        <FormControl id="password">
          <FormLabel htmlFor="password">Password</FormLabel>
          <Input
            type="password"
            name="password"
            ref={register({ required: 'password is required' })}
            isInvalid={errors.password}
          />
          <ErrorText>{errors.password && errors.password.message}</ErrorText>
        </FormControl>
      </Stack>

      <Button
        type="submit"
        marginTop={8}
        width="full"
        isLoading={isLoading}
        onClick={handleSubmit(handleLogin)}
      >
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
