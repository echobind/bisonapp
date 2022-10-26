import {
  Button,
  Circle,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import NextLink from 'next/link';

import { Link } from '@/components/Link';
import { PasswordField } from '@/components/auth/PasswordField';
import { EMAIL_REGEX } from '@/constants';

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitted },
  } = useForm<LoginFormData>({ mode: 'onChange' });

  const [loading, setLoading] = useState(false);

  async function onSubmit({ email, password }: LoginFormData) {
    if (!isValid || loading) return;

    const payload = {
      email,
      password,
    };

    setLoading(true);

    await signIn('credentials', payload);

    setLoading(false);
  }

  return (
    <Stack spacing="6" as="form" onSubmit={handleSubmit(onSubmit)}>
      <Flex flexDirection="column" justifyContent="center" marginBottom={4}>
        <Circle size="60px" bg="gray.300" color="white" alignSelf="center" />

        <Text as="h2" color="gray.400" fontSize="lg" textAlign="center" marginTop={2}>
          Welcome Back!
        </Text>
      </Flex>
      <Stack spacing="5">
        <FormControl isInvalid={Boolean(isSubmitted && errors.email)}>
          <FormLabel htmlFor="email">Email</FormLabel>
          <Input
            id="email"
            type="email"
            {...register('email', {
              required: 'Email is required.',
              pattern: {
                value: EMAIL_REGEX,
                message: 'Invalid email',
              },
            })}
          />
          {isSubmitted && errors.email ? (
            <FormErrorMessage>{errors.email.message}</FormErrorMessage>
          ) : null}
        </FormControl>
        <PasswordField
          label="Password"
          isInvalid={Boolean(isSubmitted && errors.password)}
          {...register('password', {
            required: 'Password is required.',
          })}
        >
          {isSubmitted && errors.password ? (
            <FormErrorMessage>{errors.password.message}</FormErrorMessage>
          ) : null}
        </PasswordField>
      </Stack>
      <HStack justify="space-between">
        <NextLink href="/reset-password">
          <Button variant="link" colorScheme="blue" size="sm">
            Forgot password?
          </Button>
        </NextLink>
      </HStack>
      <Stack spacing="6">
        <Button variant="outline" type="submit" disabled={loading}>
          Sign in
        </Button>
      </Stack>
      <Flex marginTop={8} justifyContent="center">
        <Text color="gray.500">
          New User?{' '}
          <Link href="/signup" color="gray.900">
            Sign Up
          </Link>
        </Text>
      </Flex>
    </Stack>
  );
}

export interface LoginFormData {
  email: string;
  password: string;
}
