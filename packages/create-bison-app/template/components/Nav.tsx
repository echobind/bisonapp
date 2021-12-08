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
          <Link href="/">Link 1</Link>
        </MenuItem>

        <MenuItem>
          <Link href="/">Link 2</Link>
        </MenuItem>

        <MenuItem>
          <Link href="/">Link 3</Link>
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
      <Link href="/">Link 1</Link>

      <Link href="/#features">Link 2</Link>
      <Link href="/#tech">Link 3</Link>
      <Link href="https://github.com/echobind/" isExternal>
        External
      </Link>
    </Stack>
  );
}
