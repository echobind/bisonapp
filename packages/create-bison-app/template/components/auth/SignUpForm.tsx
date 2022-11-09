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
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';

import { LoginFormData } from './LoginForm';

import { Link } from '@/components/Link';
import { PasswordField } from '@/components/auth/PasswordField';
import { EMAIL_REGEX, MIN_PASSWORD_LENGTH } from '@/constants';

export interface SignUpFormData extends LoginFormData {
  firstName: string;
  lastName: string;
  confirmPassword: string;
}

export function SignUpForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid, isSubmitted },
  } = useForm<SignUpFormData>({ mode: 'onChange' });

  const toast = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onSubmit({
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
  }: SignUpFormData) {
    if (!isValid || loading) return;

    const payload = {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      signUp: 'true',
    };

    setLoading(true);
    // https://next-auth.js.org/getting-started/client#using-the-redirect-false-option
    const response = await signIn('credentials', { redirect: false, ...payload });
    setLoading(false);

    if (response) {
      const {
        error,
        ok,
        // status,
        url: redirectUrl, // null if error
      } = response;

      if (error) {
        return toast({ status: 'error', isClosable: true, title: `Error`, description: error });
      }

      if (ok && redirectUrl) {
        toast({ status: 'success', isClosable: true, title: `Welcome, ${firstName}!` });

        return router.push('/');
      }

      return;
    }
  }

  return (
    <Stack spacing="6" as="form" onSubmit={handleSubmit(onSubmit)}>
      <Flex flexDirection="column" justifyContent="center" marginBottom={4}>
        <Circle size="60px" bg="gray.300" color="white" alignSelf="center" />

        <Text as="h2" fontSize="lg" textAlign="center" marginTop={2}>
          Create an account.
        </Text>
      </Flex>
      <Stack spacing="5">
        <FormControl isInvalid={Boolean(isSubmitted && errors.firstName)}>
          <FormLabel htmlFor="firstName">First Name</FormLabel>
          <Input
            id="firstName"
            type="text"
            {...register('firstName', {
              required: 'First Name is required.',
            })}
          />
          {isSubmitted && errors.firstName ? (
            <FormErrorMessage>{errors.firstName.message}</FormErrorMessage>
          ) : null}
        </FormControl>
        <FormControl isInvalid={Boolean(isSubmitted && errors.lastName)}>
          <FormLabel htmlFor="lastName">Last Name</FormLabel>
          <Input
            id="lastName"
            type="text"
            {...register('lastName', {
              required: 'Last Name is required.',
            })}
          />
          {isSubmitted && errors.lastName ? (
            <FormErrorMessage>{errors.lastName.message}</FormErrorMessage>
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
          id="password"
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
          id="confirmPassword"
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
          <Link href="/login" color="muted">
            Sign In
          </Link>
        </Text>
      </Flex>
    </Stack>
  );
}
