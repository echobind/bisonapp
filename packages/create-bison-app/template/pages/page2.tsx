import { Heading } from '@chakra-ui/react';

import { getLayout } from '../layouts/CenteredPageLayout';

export default function Page2() {
  return (
    <>
      <Heading size="lg">Page 2</Heading>
    </>
  );
}

Page2.getLayout = getLayout;
