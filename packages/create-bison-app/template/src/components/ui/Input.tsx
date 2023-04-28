import * as React from 'react';
import { VariantProps, cva } from 'class-variance-authority';

import { cn } from '@/lib/utils';

export const inputVariants = cva(
  'flex w-full rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'border border-slate-400 bg-transparent placeholder:text-gray-9 focus:ring-slate-400',
        error: 'border border-red-600 bg-transparent placeholder:text-gray-9 focus:ring-red-400',
      },
      inputSize: {
        default: 'h-12',
      },
    },
    defaultVariants: {
      variant: 'default',
      inputSize: 'default',
    },
  }
);

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  isInvalid: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ variant, inputSize, isInvalid, className, ...props }, ref) => {
    return (
      <input
        className={cn(
          inputVariants({ variant: isInvalid ? 'error' : variant, inputSize }),
          className
        )}
        ref={ref}
        aria-invalid={isInvalid}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export { Input };
