import Head from 'next/head';
import { Heading, Center } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';

import { translator } from '@/utils/i18n-translator';

function Home() {
  const { data: session } = useSession();

  const firstName = session?.user?.profile?.firstName;

  const t = translator({ ns: ['common'] });
  const welcomeMsg = t('welcome', { firstName });

  return (
    <>
      <Head>
        <title>Home</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Center>
        <Heading size="lg" data-testid="welcome-header">
          {welcomeMsg}
        </Heading>
      </Center>
    </>
  );
}

export default Home;
