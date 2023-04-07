import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import Link from 'next/link';

import { LoginFormData } from './LoginForm';

import { PasswordField } from '@/components/auth/PasswordField';
import { EMAIL_REGEX, MIN_PASSWORD_LENGTH } from '@/constants';
import { useToast } from '@/hooks/useToast';
import { Label } from '@/components/ui/Label';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

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
    formState: { errors, isValid },
  } = useForm<SignUpFormData>();

  const { toast } = useToast();
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
        return toast({ variant: 'destructive', title: `Error`, description: error });
      }

      if (ok && redirectUrl) {
        toast({ variant: 'success', title: `Welcome, ${firstName}!` });

        return router.push('/');
      }

      return;
    }
  }

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col justify-center mb-4">
        <div className="w-16 h-16 bg-gray-300 text-white self-center rounded-full" />

        <h2 className="text-lg text-center mt-2"> Create an account.</h2>
      </div>
      <div className="flex flex-col gap-5">
        <div>
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            type="text"
            isInvalid={Boolean(errors.email)}
            {...register('firstName', {
              required: 'First Name is required.',
            })}
          />
          {errors.firstName ? <p className="text-red-500">{errors.firstName.message}</p> : null}
        </div>
        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            type="text"
            isInvalid={Boolean(errors.lastName)}
            {...register('lastName', {
              required: 'Last Name is required.',
            })}
          />
          {errors.lastName ? <p className="text-red-500">{errors.lastName.message}</p> : null}
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
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
          id="password"
          label="Password"
          isInvalid={Boolean(errors.password)}
          autoComplete="new-password"
          {...register('password', {
            required: 'Password is required.',
            minLength: {
              value: MIN_PASSWORD_LENGTH,
              message: `Password must be ${MIN_PASSWORD_LENGTH} characters.`,
            },
          })}
        >
          {errors.password ? <p className="text-red-500">{errors.password.message}</p> : null}
        </PasswordField>
        <PasswordField
          id="confirmPassword"
          label="Confirm Password"
          isInvalid={Boolean(errors.confirmPassword)}
          autoComplete="new-password"
          {...register('confirmPassword', {
            required: 'Confirmation password is required.',
            validate: (value) => value === watch('password') || "Passwords don't match.",
          })}
        >
          {errors.confirmPassword ? (
            <p className="text-red-500">{errors.confirmPassword.message}</p>
          ) : null}
        </PasswordField>
      </div>

      <div className="flex gap-6 flex-col">
        <Button variant="outline" type="submit" disabled={loading}>
          Sign up
        </Button>
      </div>

      <div className="flex justify-center mt-8">
        <span className="text-slate-500">
          Have an account? <Link href="/login">Log In</Link>
        </span>
      </div>
    </form>
  );
}
