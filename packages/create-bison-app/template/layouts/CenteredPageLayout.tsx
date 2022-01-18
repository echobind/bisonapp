import { Flex } from '@chakra-ui/react';

export type CenteredPageLayoutProps = {
  children: React.ReactNode;
};

export const CenteredPageLayout = ({ children }: CenteredPageLayoutProps) => (
  <Flex direction="column" minH="100vh" bg="pink" align="center" justify="center">
    {children}
  </Flex>
);

export const getLayout = (page: any) => <CenteredPageLayout>{page}</CenteredPageLayout>;
