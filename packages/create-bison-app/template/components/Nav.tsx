import React from 'react';
import {
  Stack,
  useBreakpoint,
  Button,
  MenuButton,
  Menu,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';

import { Link } from './Link';

export function Nav() {
  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === 'base';

  return isMobile ? (
    <Menu>
      <MenuButton as={Button} variant="outline" colorScheme="lightPurple" ml="auto">
        =
      </MenuButton>

      <MenuList width="full">
        <MenuItem>
          <NextLink href="/page1" passHref>
            <Link>Link 1</Link>
          </NextLink>
        </MenuItem>

        <MenuItem>
          <NextLink href="/page1" passHref>
            <Link>Link 2</Link>
          </NextLink>
        </MenuItem>

        <MenuItem>
          <NextLink href="/page3" passHref>
            <Link>Link 3</Link>
          </NextLink>
        </MenuItem>

        <MenuItem>
          <Link href="https://github.com/echobind" isExternal>
            External
          </Link>
        </MenuItem>
      </MenuList>
    </Menu>
  ) : (
    <Stack as="nav" direction="row" ml="auto" alignItems="center" fontSize="md" spacing={8}>
      <NextLink href="/page1" passHref>
        <Link>Link 1</Link>
      </NextLink>

      <NextLink href="/page2" passHref>
        <Link>Link 2</Link>
      </NextLink>

      <NextLink href="/page3" passHref>
        <Link>Link 3</Link>
      </NextLink>

      <Link href="https://github.com/echobind/" isExternal>
        External
      </Link>
    </Stack>
  );
}
