import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { gql } from '@apollo/client';

import { cookies } from '@/lib/cookies';
import { useMeLazyQuery, User } from '@/types';
import { FullPageSpinner } from '@/components/FullPageSpinner';
import { LOGIN_TOKEN_KEY } from '@/constants';

const oneYearMs = 365 * 24 * 60 * 60 * 1000;
// how long a login session lasts in milliseconds
const sessionLifetimeMs = oneYearMs;

const AuthContext = createContext<AuthContextObject>({
  login: () => ({}),
  logout: () => ({}),
});

AuthContext.displayName = 'AuthContext';

export const ME_QUERY = gql`
  query me {
    me {
      id
      email
    }
  }
`;

function AuthProvider({ ...props }: Props) {
  const [tokenLoaded, setTokenLoaded] = useState(true);
  const [loadCurrentUser, { called, data, loading, refetch }] = useMeLazyQuery();
  const user = data?.me;

  // Load current user if there's a token
  useEffect(() => {
    if (called) return;

    async function fetchUser() {
      const token = cookies().get(LOGIN_TOKEN_KEY);
      setTokenLoaded(true);
      if (token) await loadCurrentUser();
    }

    fetchUser();
  }, [loadCurrentUser, called]);

  if (!tokenLoaded || (tokenLoaded && loading)) {
    return <FullPageSpinner />;
  }

  /**
   * Logs in a user by setting an auth token in a cookie. We use cookies so they are available in SSR.
   * @param token the token to login with
   */
  function login(token: string) {
    cookies().set(LOGIN_TOKEN_KEY, token, {
      path: '/',
      expires: new Date(Date.now() + sessionLifetimeMs),
    });

    const fetchUserData = called ? refetch : loadCurrentUser;
    return fetchUserData();
  }

  /**
   * Logs out a user by removing their token from cookies.
   */
  async function logout() {
    cookies().remove(LOGIN_TOKEN_KEY, { path: '/' });

    // TODO: remove from cache rather than call API
    const fetchUserData = called ? refetch : loadCurrentUser;
    return fetchUserData();
  }

  const value = { user, login, logout };
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
