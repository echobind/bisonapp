import React from 'react';
import { Text, TextProps } from '@chakra-ui/react';

/** Renders error text under form inputs */
export function ErrorText({ children, ...textProps }: TextProps) {
  return (
    <Text color="red.500" fontSize="sm" textAlign="right" mt={1} {...textProps}>
      {children}
    </Text>
  );
}
