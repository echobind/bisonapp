import type { PropsWithChildren } from 'react';
import type { LinkProps as NextLinkProps } from 'next/link';
import React from 'react';
import NextLink from 'next/link';
import {
  Button as ChakraButton,
  ButtonProps as ChakraButtonProps,
  BreadcrumbLink as ChakraBreadcrumbLink,
  BreadcrumbLinkProps as ChakraBreadcrumbLinkProps,
  Link as ChakraLink,
  LinkProps as ChakraLinkProps,
} from '@chakra-ui/react';

export type NextLinkAs = NextLinkProps['as'];

export type LinkProps<T> =
  | PropsWithChildren<NextLinkProps & Omit<T, 'as'>>
  | PropsWithChildren<Omit<NextLinkProps, 'as'> & T>;

type ChakraLinkAs = ChakraLinkProps['as'];

//  Has to be a new component because both chakra and next share the `as` keyword
export const Link = ({
  href,
  as,
  replace,
  scroll,
  shallow,
  prefetch,
  locale,
  isExternal,
  children,
  ...chakraProps
}: LinkProps<ChakraLinkProps>) => {
  return isExternal ? (
    <ChakraLink href={href} as={as as ChakraLinkAs} isExternal {...chakraProps}>
      {children}
    </ChakraLink>
  ) : (
    <NextLink
      passHref={true}
      href={href}
      as={as as NextLinkAs}
      replace={replace}
      scroll={scroll}
      shallow={shallow}
      prefetch={prefetch}
      locale={locale}
    >
      <ChakraLink {...chakraProps}>{children}</ChakraLink>
    </NextLink>
  );
};

export const ButtonLink = ({
  href,
  as,
  replace,
  scroll,
  shallow,
  prefetch,
  locale,
  children,
  ...chakraProps
}: LinkProps<ChakraButtonProps>) => {
  return (
    <NextLink
      passHref={true}
      href={href}
      as={as as NextLinkAs}
      replace={replace}
      scroll={scroll}
      shallow={shallow}
      prefetch={prefetch}
      locale={locale}
    >
      <ChakraButton as="a" {...chakraProps}>
        {children}
      </ChakraButton>
    </NextLink>
  );
};

export const BreadcrumbLink = ({
  href,
  as,
  replace,
  scroll,
  shallow,
  prefetch,
  locale,
  children,
  ...chakraProps
}: LinkProps<ChakraBreadcrumbLinkProps>) => {
  return (
    <NextLink
      passHref={true}
      href={href}
      as={as as NextLinkAs}
      replace={replace}
      scroll={scroll}
      shallow={shallow}
      prefetch={prefetch}
      locale={locale}
    >
      <ChakraBreadcrumbLink {...chakraProps}>{children}</ChakraBreadcrumbLink>
    </NextLink>
  );
};
