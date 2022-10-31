import { createContext, useContext, ReactNode, useMemo, useState, useEffect } from 'react';
import { User } from '@prisma/client';

import { cookies } from '@/lib/cookies';
import { FullPageSpinner } from '@/components/FullPageSpinner';
import { LOGIN_TOKEN_KEY } from '@/constants';
import { trpc } from '@/lib/trpc';

const oneYearMs = 365 * 24 * 60 * 60 * 1000;
// how long a login session lasts in milliseconds
const sessionLifetimeMs = oneYearMs;

const AuthContext = createContext<AuthContextObject>({
  login: () => ({}),
  logout: () => ({}),
});

AuthContext.displayName = 'AuthContext';

function AuthProvider({ ...props }: Props) {
  const [token, setToken] = useState(null);

  useEffect(() => {
    // We set the token in useEffect to make sure the page properly
    // hydrates, since the server doesn't have access to the cookie
    // at this point in the rendering process.
    setToken(cookies().get(LOGIN_TOKEN_KEY));
  }, []);

  const meQuery = trpc.user.me.useQuery(undefined, { enabled: !!token });

  const user = meQuery.data || null;

  const value = useMemo(() => {
    /**
     * Logs in a user by setting an auth token in a cookie. We use cookies so they are available in SSR.
     * @param token the token to login with
     */
    function login(token: string) {
      cookies().set(LOGIN_TOKEN_KEY, token, {
        path: '/',
        expires: new Date(Date.now() + sessionLifetimeMs),
      });

      return meQuery.refetch();
    }

    /**
     * Logs out a user by removing their token from cookies.
     */
    async function logout() {
      cookies().remove(LOGIN_TOKEN_KEY, { path: '/' });
      setToken(null);
      meQuery.remove();
    }

    return { user, login, logout };
  }, [meQuery, user]);

  if (!!token && meQuery.isInitialLoading) {
    return <FullPageSpinner />;
  }

  return <AuthContext.Provider value={value} {...props} />;
}

const useAuth = () => useContext(AuthContext);
export { AuthProvider, useAuth };

interface Props {
  loggedInUser?: Partial<User> | null;
  children: ReactNode;
}

export interface AuthContextObject {
  user?: Partial<User> | null;
  login: (token: string) => any;
  logout: () => any;
}
