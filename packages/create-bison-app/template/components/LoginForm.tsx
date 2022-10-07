import { useRouter } from 'next/router';
import { Flex, Text, FormControl, FormLabel, Input, Stack, Button, Circle } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { inferProcedureInput } from '@trpc/server';

import { EMAIL_REGEX } from '@/constants';
import { useAuth } from '@/context/auth';
import { ErrorText } from '@/components/ErrorText';
import { Link } from '@/components/Link';
import { setErrorsFromTRPCError } from '@/utils/setErrors';
import { AppRouter } from '@/server/routers/_app';
import { trpc } from '@/lib/trpc';

type LoginInput = inferProcedureInput<AppRouter['user']['login']>;

/** Form to Login */
export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginInput>();

  const loginMutation = trpc.user.login.useMutation();

  const { login: loginUser } = useAuth();
  const router = useRouter();

  /**
   * Submits the login form
   * @param formData the data passed from the form hook
   */
  async function handleLogin(formData: LoginInput) {
    try {
      const loginData = await loginMutation.mutateAsync(formData);

      if (!loginData?.token) {
        throw new Error('Login failed.');
      }

      await loginUser(loginData.token);
      await router.replace('/');
    } catch (e: any) {
      setErrorsFromTRPCError(setError, e);
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
            {...register('password', { required: 'password is required' })}
            isInvalid={!!errors.password}
          />
          <ErrorText>{errors.password && errors.password.message}</ErrorText>
        </FormControl>
      </Stack>

      <Button
        type="submit"
        marginTop={8}
        width="full"
        isLoading={loginMutation.isLoading}
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
          <Link href="/signup" color="gray.900">
            Sign Up
          </Link>
        </Text>
      </Flex>
    </form>
  );
}
