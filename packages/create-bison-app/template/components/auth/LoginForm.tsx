import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import Link from 'next/link';

import { PasswordField } from '@/components/auth/PasswordField';
import { EMAIL_REGEX } from '@/constants';
import { useToast } from '@/hooks/useToast';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/Label';
import { Input } from '@/components/ui/Input';

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormData>();

  const [loading, setLoading] = useState(false);
  const [signInError, setSignInError] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  async function onSubmit({ email, password }: LoginFormData) {
    if (!isValid || loading) return;

    const payload = {
      email,
      password,
    };

    setLoading(true);

    // https://next-auth.js.org/getting-started/client#using-the-redirect-false-option
    const response = await signIn('credentials', { redirect: false, ...payload });

    setLoading(false);

    if (response) {
      if (response?.error) {
        return setSignInError(response.error);
      }

      if (response.ok === true) {
        toast({ title: 'Welcome!', variant: 'success' });

        return router.push('/');
      }
    }

    return;
  }

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col justify-center mb-4">
        <div className="w-16 h-16 bg-gray-300 text-white self-center rounded-full" />

        <h2 className="text-lg text-center mt-2">Welcome Back!</h2>
      </div>
      <div className="flex flex-col gap-5">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            data-testid="login-email"
            isInvalid={Boolean(errors.email)}
            {...register('email', {
              required: 'Email is required.',
              pattern: {
                value: EMAIL_REGEX,
                message: 'Invalid email',
              },
            })}
          />
          {errors.email ? <p className="text-red-500">{errors.email.message}</p> : null}
        </div>
        <PasswordField
          label="Password"
          data-testid="login-password"
          isInvalid={Boolean(errors.password)}
          {...register('password', {
            required: 'Password is required.',
          })}
        >
          {errors.password ? <p className="text-red-500">{errors.password.message}</p> : null}
        </PasswordField>
      </div>
      <div className="flex justify-between">
        <NextLink href="/reset-password">
          <Button variant="link" size="sm">
            Forgot password?
          </Button>
        </NextLink>
      </div>
      <div className="flex gap-6 flex-col">
        <Button variant="outline" type="submit" disabled={loading} data-testid="login-submit">
          Sign in
        </Button>
        {signInError && <p className="text-red-700">No User Found</p>}
      </div>
      <div className="flex justify-center mt-8">
        <span className="text-slate-500">
          New User? <Link href="/signup">Sign Up</Link>
        </span>
      </div>
    </form>
  );
}

export interface LoginFormData {
  email: string;
  password: string;
}
