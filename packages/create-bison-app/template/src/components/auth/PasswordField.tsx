import * as React from 'react';
import { Eye, EyeOff } from 'lucide-react';

import { useDisclosure } from '@/hooks/useDisclosure';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/Label';
import { InputProps, inputVariants } from '@/components/ui/Input';

type PasswordFieldProps = InputProps & {
  id?: string;
  name: string;
  label: string;
};

export const PasswordField = React.forwardRef<HTMLInputElement, PasswordFieldProps>(
  ({ name, id, label, children, isInvalid, className, ...props }, ref) => {
    id = id || name;

    const { isOpen, onToggle } = useDisclosure();

    const onClickReveal = () => {
      onToggle();
    };

    return (
      <div>
        <Label htmlFor={id}>{label}</Label>
        <div className="relative">
          <input
            id={id}
            ref={ref}
            name={name}
            type={isOpen ? 'text' : 'password'}
            autoComplete="current-password"
            required
            aria-invalid={isInvalid}
            className={cn(
              inputVariants({ variant: isInvalid ? 'error' : 'default' }),
              'flex items-center pr-16',
              className
            )}
            {...props}
          />
          <Button
            variant="link"
            type="button"
            className="absolute right-0 top-0 h-full flex items-center justify-center"
            aria-label={isOpen ? 'Mask password' : 'Reveal password'}
            children={isOpen ? <EyeOff /> : <Eye />}
            onClick={onClickReveal}
          />
        </div>
        {children}
      </div>
    );
  }
);

PasswordField.displayName = 'PasswordField';
