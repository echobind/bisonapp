import Head from 'next/head';

import { CenteredBoxForm } from '@/components/CenteredBoxForm';
import { SignUpForm } from '@/components/auth/SignUpForm';

function SignupPage() {
  return (
    <>
      <Head>
        <title>Signup Page</title>
      </Head>

      <CenteredBoxForm>
        <SignUpForm />
      </CenteredBoxForm>
    </>
  );
}

export default SignupPage;
