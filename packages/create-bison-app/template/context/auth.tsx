import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { gql } from '@apollo/client';

import { cookies } from '@/lib/cookies';
import { useMeLazyQuery, User } from '@/types';
import { FullPageSpinner } from '@/components/FullPageSpinner';
import { LOGIN_TOKEN_KEY } from '@/constants';

const now = new Date();
const timeValidInMs = 365 * 24 * 60 * 60 * 1000;
const COOKIE_EXPIRE_DATE = new Date(now.getTime() + timeValidInMs);

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

  // Load current user if there's an item in local storage
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
    cookies().set(LOGIN_TOKEN_KEY, token, { path: '/', expires: COOKIE_EXPIRE_DATE });

    const fetchUserData = called ? refetch : loadCurrentUser;
    return fetchUserData();
  }

  /**
   * Logs out a user by removing their token from cookies.
   */
  async function logout() {
    cookies().remove(LOGIN_TOKEN_KEY, { path: '/', expires: COOKIE_EXPIRE_DATE });

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
