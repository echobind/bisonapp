import React, { useState } from 'react';
import { Flex, Text, FormControl, FormLabel, Input, Stack, Button, Circle } from '@chakra-ui/react';
import { gql } from '@apollo/client';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';

import { useAuth } from '@/context/auth';
import { setErrorsFromGraphQLErrors } from '@/utils/setErrors';
import { SignupMutationVariables, useSignupMutation } from '@/types';
import { EMAIL_REGEX } from '@/constants';
import { Link } from '@/components/Link';
import { ErrorText } from '@/components/ErrorText';

export const SIGNUP_MUTATION = gql`
  mutation signup($data: SignupInput!) {
    signup(data: $data) {
      token
      user {
        id
      }
    }
  }
`;

type SignupFormValue = Pick<SignupMutationVariables['data'], 'email' | 'password'> &
  Pick<SignupMutationVariables['data']['profile']['create'], 'firstName' | 'lastName'>;

/** Form to sign up */
export function SignupForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<SignupFormValue>();

  const [isLoading, setIsLoading] = useState(false);
  const [signup] = useSignupMutation();
  const { login } = useAuth();
  const router = useRouter();

  /**
   * Submits the login form
   * @param formData the data passed from the form hook
   */
  async function handleSignup(formData: SignupFormValue) {
    try {
      setIsLoading(true);
      const { email, password, ...profile } = formData;

      const variables: SignupMutationVariables = {
        data: { email, password, profile: { create: profile } },
      };

      const { data } = await signup({ variables });

      if (!data?.signup?.token) {
        throw new Error('Signup failed.');
      }

      await login(data.signup.token);

      router.replace('/');
    } catch (e: any) {
      setErrorsFromGraphQLErrors(setError, e.graphQLErrors);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(handleSignup)}>
      <Flex flexDirection="column" justifyContent="center" marginBottom={4}>
        <Circle size="60px" bg="gray.300" color="white" alignSelf="center" />

        <Text as="h2" color="gray.400" fontSize="lg" textAlign="center" marginTop={2}>
          Create an account.
        </Text>
      </Flex>

      <Stack spacing={4}>
        <FormControl id="email">
          <FormLabel htmlFor="email">Email address</FormLabel>
          <Input
            type="text"
            {...register('email', {
              required: 'email is required',
              pattern: {
                value: EMAIL_REGEX,
                message: 'invalid email',
              },
            })}
            isInvalid={!!errors.email}
          />
          <ErrorText>{errors.email && errors.email.message}</ErrorText>
        </FormControl>

        <FormControl id="password">
          <FormLabel htmlFor="password">Password</FormLabel>
          <Input
            type="password"
            {...register('password', { required: 'password is required', minLength: 8 })}
            isInvalid={!!errors.password}
          />
          <ErrorText>{errors.password && errors.password.message}</ErrorText>
        </FormControl>

        <FormControl id="firstName">
          <FormLabel>First Name</FormLabel>
          <Input
            type="text"
            {...register('firstName', { required: true })}
            isInvalid={!!errors.firstName}
          />
          <ErrorText>{errors.firstName && errors.firstName.message}</ErrorText>
        </FormControl>

        <FormControl id="lastName">
          <FormLabel>Last Name</FormLabel>
          <Input
            type="text"
            {...register('lastName', { required: true })}
            isInvalid={!!errors.lastName}
          />
          <ErrorText>{errors.lastName && errors.lastName.message}</ErrorText>
        </FormControl>
      </Stack>

      <Button type="submit" marginTop={8} width="full" isLoading={isLoading}>
        Signup
      </Button>

      <Flex marginTop={8} justifyContent="center">
        <Text color="gray.500">
          Have an account?{' '}
          <Link href="/login" color="gray.900">
            Sign In
          </Link>
        </Text>
      </Flex>
    </form>
  );
}
