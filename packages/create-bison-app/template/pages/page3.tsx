import { Heading } from '@chakra-ui/react';

import { getLayout } from '../layouts/CenteredPageLayout';

export default function Page3() {
  return (
    <>
      <Heading size="lg">Page 3</Heading>
    </>
  );
}

Page3.getLayout = getLayout;
