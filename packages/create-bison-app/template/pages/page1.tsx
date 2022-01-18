import { Heading } from '@chakra-ui/react';

import { getLayout } from '../layouts/CenteredPageLayout';

export default function Page1() {
  return (
    <>
      <Heading size="lg">Page 1</Heading>
    </>
  );
}

Page1.getLayout = getLayout;
