import React from 'react';
import { Heading } from '@chakra-ui/react';

import { Link } from './Link';

export function Logo() {
  return (
    <Heading as={Link} href="/" size="md">
      MyApp
    </Heading>
  );
}
