import { Center, Flex, Text } from '@chakra-ui/layout';

import { Logo } from './Logo';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <Center as="footer" mt="auto" py={4}>
      <Flex flexDirection="column" alignItems="center">
        <Logo />
        <Text as="em" textAlign="center">
          Copyright Ⓒ {year}{' '}
          <a href="https://echobind.com" target="_blank" rel="noopener noreferrer">
            Echobind LLC.
          </a>{' '}
          All rights reserved.
        </Text>
      </Flex>
    </Center>
  );
}
