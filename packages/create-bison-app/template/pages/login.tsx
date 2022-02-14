import React from 'react';
import Head from 'next/head';

import { CenteredBoxForm } from '@/components/CenteredBoxForm';
import { LoginForm } from '@/components/LoginForm';

function LoginPage() {
  return (
    <>
      <Head>
        <title>LoginPage</title>
      </Head>

      <CenteredBoxForm>
        <LoginForm />
      </CenteredBoxForm>
    </>
  );
}

export default LoginPage;
