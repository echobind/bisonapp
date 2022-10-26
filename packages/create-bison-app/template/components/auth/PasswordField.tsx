import {
  FormControl,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputProps,
  InputRightElement,
  useDisclosure,
  useMergeRefs,
} from '@chakra-ui/react';
import * as React from 'react';
import { HiEye, HiEyeOff } from 'react-icons/hi';

type PasswordFieldProps = InputProps & {
  id?: string;
  name: string;
  label: string;
};

export const PasswordField = React.forwardRef<HTMLInputElement, PasswordFieldProps>(
  ({ name, id, label, children, isInvalid, ...props }, ref) => {
    id = id || name;

    const { isOpen, onToggle } = useDisclosure();
    const inputRef = React.useRef<HTMLInputElement>(null);

    const mergeRef = useMergeRefs(inputRef, ref);

    const onClickReveal = () => {
      onToggle();

      if (inputRef.current) {
        inputRef.current.focus({ preventScroll: true });
      }
    };

    return (
      <FormControl isInvalid={isInvalid}>
        <FormLabel htmlFor={id}>{label}</FormLabel>
        <InputGroup>
          <Input
            id={id}
            ref={mergeRef}
            name={name}
            type={isOpen ? 'text' : 'password'}
            autoComplete="current-password"
            required
            {...props}
          />
          <InputRightElement>
            <IconButton
              variant="link"
              aria-label={isOpen ? 'Mask password' : 'Reveal password'}
              icon={isOpen ? <HiEyeOff /> : <HiEye />}
              onClick={onClickReveal}
            />
          </InputRightElement>
        </InputGroup>
        {children}
      </FormControl>
    );
  }
);

PasswordField.displayName = 'PasswordField';
