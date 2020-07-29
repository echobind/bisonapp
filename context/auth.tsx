import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { gql } from '@apollo/client';

import { useMeLazyQuery, User } from '../types';
import { FullPageSpinner } from '../components/FullPageSpinner';

export const LOGIN_TOKEN_KEY = 'myapp-user';

const AuthContext = createContext<AuthContextObject>({});
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
  const [loadCurrentUser, { data, loading, refetch }] = useMeLazyQuery();
  const user = data?.me;

  // Load current user if there's an item in local storage
  useEffect(() => {
    localStorage.getItem(LOGIN_TOKEN_KEY);
    setTokenLoaded(true);
    loadCurrentUser();
  }, [loadCurrentUser]);

  if (!tokenLoaded || (tokenLoaded && loading)) {
    return <FullPageSpinner />;
  }

  /**
   * Logs in a user by setting an auth token in a cookie. We use cookies so they are available in SSR.
   * @param token the token to login with
   */
  function login(token) {
    localStorage.setItem(LOGIN_TOKEN_KEY, token);

    return refetch();
  }

  /**
   * Logs out a user by removing their token from cookies.
   */
  async function logout() {
    localStorage.removeItem(LOGIN_TOKEN_KEY);

    return refetch();
  }

  const value = { user, login, logout };
  return <AuthContext.Provider value={value} {...props} />;
}

const useAuth = () => useContext(AuthContext);
export { AuthProvider, useAuth };

interface Props {
  loggedInUser?: Partial<User>;
  children: ReactNode;
}

export interface AuthContextObject {
  user?: Partial<User>;
  login?: (token?: string) => any;
  logout?: () => any;
}
