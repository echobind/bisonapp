import React from 'react';
import { Spinner, Center } from '@chakra-ui/react';

/** Renders a full page loading spinner */
export function FullPageSpinner() {
  return (
    <Center height="100vh" width="100vw">
      <Spinner />
    </Center>
  );
}
