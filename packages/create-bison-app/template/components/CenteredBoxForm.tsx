import { ReactNode } from 'react';
import { Box, useColorModeValue } from '@chakra-ui/react';

interface Props {
  children: ReactNode;
}

/** A form with a centered box. Ex: Login, Signup */
export function CenteredBoxForm({ children }: Props) {
  return (
    <Box
      margin="auto"
      borderRadius="xl"
      width={{ base: 'auto', lg: 400 }}
      boxShadow={{ base: 'none', sm: useColorModeValue('md', 'md-dark') }}
      padding={8}
      bg="bg-surface"
      marginY={{ base: 4, lg: 16 }}
      marginX={{ base: 8, lg: 'auto' }}
    >
      {children}
    </Box>
  );
}
