import { theme as ChakraTheme } from '@chakra-ui/pro-theme';
import { extendTheme, type ThemeConfig } from '@chakra-ui/react';
import { withProse } from '@nikolovlazar/chakra-ui-prose';

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: true,
};

const theme = extendTheme(
  {
    config,
    colors: {
      ...ChakraTheme.colors,
      brand: 'theme.colors.blue',
      black: '#000000',
      white: '#FFFFFF',
    },
  },
  withProse({}),
  ChakraTheme
);

export default theme;
