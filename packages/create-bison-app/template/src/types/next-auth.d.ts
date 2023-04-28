import { UserWithRelations } from '@/lib/prisma';
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
    user: UserWithRelations;
  }
}

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: UserWithRelations;
    isAdmin: boolean;
    idToken?: string;
    accessToken?: string;
  }
}
