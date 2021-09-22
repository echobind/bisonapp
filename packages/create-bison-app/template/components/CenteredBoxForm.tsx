import React from 'react';
import { Box } from '@chakra-ui/react';

interface Props {
  children: React.ReactNode;
}

/** A form with a centered box. Ex: Login, Signup */
export function CenteredBoxForm({ children }: Props) {
  return (
    <Box
      margin="auto"
      borderRadius="md"
      width={{ base: 'auto', lg: 400 }}
      boxShadow="md"
      borderColor="gray.200"
      borderWidth={1}
      padding={8}
      bg="white"
      marginY={{ base: 4, lg: 16 }}
      marginX={{ base: 8, lg: 'auto' }}
    >
      {children}
    </Box>
  );
}
