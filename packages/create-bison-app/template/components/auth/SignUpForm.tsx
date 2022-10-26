import {
  Button,
  Circle,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';

import { LoginFormData } from './LoginForm';

import { Link } from '@/components/Link';
import { PasswordField } from '@/components/auth/PasswordField';
import { EMAIL_REGEX, MIN_PASSWORD_LENGTH } from '@/constants';

export function SignUpForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid, isSubmitted },
  } = useForm<SignUpFormData>({ mode: 'onChange' });

  const [loading, setLoading] = useState(false);

  async function onSubmit({ name, email, password, confirmPassword }: SignUpFormData) {
    if (!isValid || loading) return;

    const payload = {
      name,
      email,
      password,
      confirmPassword,
      signUp: 'true',
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
          Create an account.
        </Text>
      </Flex>
      <Stack spacing="5">
        <FormControl isInvalid={Boolean(isSubmitted && errors.name)}>
          <FormLabel htmlFor="name">Name</FormLabel>
          <Input
            id="name"
            type="text"
            {...register('name', {
              required: 'Name is required.',
            })}
          />
          {isSubmitted && errors.name ? (
            <FormErrorMessage>{errors.name.message}</FormErrorMessage>
          ) : null}
        </FormControl>
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
          autoComplete="new-password"
          {...register('password', {
            required: 'Password is required.',
            minLength: {
              value: MIN_PASSWORD_LENGTH,
              message: `Password must be ${MIN_PASSWORD_LENGTH} characters.`,
            },
          })}
        >
          {isSubmitted && errors.password ? (
            <FormErrorMessage>{errors.password.message}</FormErrorMessage>
          ) : null}
        </PasswordField>
        <PasswordField
          label="Confirm Password"
          isInvalid={Boolean(isSubmitted && errors.confirmPassword)}
          autoComplete="new-password"
          {...register('confirmPassword', {
            required: 'Confirmation password is required.',
            validate: (value) => value === watch('password') || "Passwords don't match.",
          })}
        >
          {' '}
          {isSubmitted && errors.confirmPassword ? (
            <FormErrorMessage>{errors.confirmPassword.message}</FormErrorMessage>
          ) : null}
        </PasswordField>
      </Stack>

      <Stack spacing="6">
        <Button variant="outline" type="submit" disabled={loading}>
          Sign up
        </Button>
      </Stack>

      <Flex marginTop={8} justifyContent="center">
        <Text color="gray.500">
          Have an account?{' '}
          <Link href="/login" color="gray.900">
            Sign In
          </Link>
        </Text>
      </Flex>
    </Stack>
  );
}

export interface SignUpFormData extends LoginFormData {
  name: string;
  confirmPassword: string;
}
