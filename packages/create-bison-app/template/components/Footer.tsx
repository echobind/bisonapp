import { Center, Flex, Text } from '@chakra-ui/layout';

import { Logo } from './Logo';
import { Link } from './Link';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <Center as="footer" mt="auto" py={4}>
      <Flex flexDirection="column" alignItems="center">
        <Logo />
        <Text as="em" textAlign="center">
          Copyright Ⓒ {year}{' '}
          <Link href="https://echobind.com" isExternal>
            Echobind LLC.
          </Link>{' '}
          All rights reserved.
        </Text>
      </Flex>
    </Center>
  );
}
