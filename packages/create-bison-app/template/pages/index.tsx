import Head from 'next/head';
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

      <div className="flex items-center justify-center">
        <h1 className="text-3xl font-bold" data-testid="welcome-header">
          {welcomeMessage}
        </h1>
      </div>
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
