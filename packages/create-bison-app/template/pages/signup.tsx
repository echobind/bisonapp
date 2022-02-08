import React from 'react';
import Head from 'next/head';

import { CenteredBoxForm } from '@/components/CenteredBoxForm';
import { SignupForm } from '@/components/SignupForm';

function SignupPage() {
  return (
    <>
      <Head>
        <title>Signup Page</title>
      </Head>

      <CenteredBoxForm>
        <SignupForm />
      </CenteredBoxForm>
    </>
  );
}

export default SignupPage;
