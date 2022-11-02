import { Profile, User } from '@prisma/client';
import NextAuth, { DefaultSession } from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    /** OpenID ID Token */
    idToken?: string;
    // For OAuth Refresh
    accessToken?: string;
    // Match Prisma Return
    user: User & {
      profile: Profile | null;
    };
  }
}

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    // Should Pick<> or Omit<> what we expect here.
    user: Partial<User> & {
      profile?: Partial<Profile>;
    };
    isAdmin: boolean;
    idToken?: string;
    accessToken?: string;
  }
}
Copy;
