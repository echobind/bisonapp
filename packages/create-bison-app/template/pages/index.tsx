import Head from 'next/head';
import { Heading, Center } from '@chakra-ui/react';
import { GetServerSideProps } from 'next';

import { translator } from '@/utils/i18n-translator';
import { getServerAuthSession } from '@/utils/getDefaultServerSideProps';

type PageProps = {
  welcomeMessage: string;
};

function Home({ welcomeMessage }: PageProps) {
  return (
    <>
      <Head>
        <title>Home</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Center>
        <Heading size="lg" data-testid="welcome-header">
          {welcomeMessage}
        </Heading>
      </Center>
    </>
  );
}

export default Home;

export const getServerSideProps: GetServerSideProps<PageProps> = async (context: any) => {
  const session = await getServerAuthSession(context);

  const firstName = session?.user?.profile?.firstName || 'Guest';

  const t = translator({ ns: ['common'] });
  const welcomeMessage = t('welcome', { firstName });

  const props: PageProps = { welcomeMessage };

  return {
    props,
  };
};
