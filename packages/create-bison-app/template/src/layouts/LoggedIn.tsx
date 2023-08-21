import { ReactNode } from 'react';
import { signOut } from 'next-auth/react';

import { Logo } from '@/components/Logo';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/Button';

interface Props {
  children: ReactNode;
}

export function LoggedInLayout({ children }: Props) {
  async function handleLogout() {
    await signOut({ callbackUrl: '/login' });
  }

  return (
    <div className="flex flex-col min-h-screen">
      <>
        <div className="flex p-4">
          <Logo />

          <Nav />

          <Button variant="outline" className="ml-16" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </>

      <div className="flex-1 mt-8">{children}</div>

      <Footer />
    </div>
  );
}
