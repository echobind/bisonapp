import { ReactNode } from 'react';
import Link from 'next/link';

import { Logo } from '@/components/Logo';
import { Footer } from '@/components/Footer';
import { buttonVariants } from '@/components/ui/Button';
interface Props {
  children: ReactNode;
}

export function LoggedOutLayout({ children }: Props) {
  return (
    <div className="flex flex-col min-h-screen">
      <>
        <div className="flex justify-between items-center p-4">
          <Logo />

          <Link className={buttonVariants({ variant: 'outline' })} href="/login" passHref>
            Login
          </Link>
        </div>
      </>

      <div className="flex-1 mt-8">{children}</div>

      <Footer />
    </div>
  );
}
