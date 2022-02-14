/* eslint-disable no-restricted-globals */
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import fetch from 'cross-fetch';

import { cookies } from './cookies';

import { LOGIN_TOKEN_KEY } from '@/constants';

export function createApolloClient(ctx?: Record<string, any>) {
  // Apollo needs an absolute URL when in SSR, so determine host
  let host: string;
  let protocol: string;
  let hostUrl = process.env.API_URL;

  if (ctx) {
    host = ctx?.req.headers['x-forwarded-host'];
    protocol = ctx?.req.headers['x-forwarded-proto'] || 'http';
    hostUrl = `${protocol}://${host}`;
  } else if (typeof location !== 'undefined') {
    host = location.host;
    protocol = location.protocol;
    hostUrl = `${protocol}//${host}`;
  }

  const uri = `${hostUrl}/api/graphql`;

  const httpLink = createHttpLink({
    uri,
    fetch,
  });

  const authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    const token = cookies().get(LOGIN_TOKEN_KEY);
    // const token = localStorage.getItem(LOGIN_TOKEN_KEY);
    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : '',
      },
    };
  });

  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });

  return client;
}
