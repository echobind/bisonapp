import React from 'react';
import { Heading } from '@chakra-ui/react';
import NextLink from 'next/link';

export function Logo() {
  return (
    <NextLink href="/" passHref>
      <Heading as="a" size="md">
        MyApp
      </Heading>
    </NextLink>
  );
}
