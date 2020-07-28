/* eslint-disable no-restricted-globals */
import { ApolloClient, InMemoryCache } from '@apollo/client';

export function createApolloClient(ctx?: Record<string, any>) {
  // Apollo needs an absolute URL when in SSR, so determine host
  let host, protocol;
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

  const client = new ApolloClient({
    uri,
    cache: new InMemoryCache(),
  });

  return client;
}

// /* eslint-disable no-restricted-globals */
// import { ApolloClient } from 'apollo-client';
// import { InMemoryCache } from 'apollo-cache-inmemory';
// import { HttpLink } from 'apollo-link-http';
// import { setContext } from 'apollo-link-context';
// import fetch from 'isomorphic-unfetch';
// import { cookies } from './cookies';

// export function createApolloClient(initialState = {}, ctx?) {
//   // The `ctx` (NextPageContext) will only be present on the server.
//   // use it to extract auth headers (ctx.req) or similar.

//   // Apollo needs an absolute URL when in SSR, so determine host
//   let host, protocol;
//   let hostUrl = process.env.API_URL;

//   if (ctx) {
//     host = ctx?.req.headers['x-forwarded-host'];
//     protocol = ctx?.req.headers['x-forwarded-proto'] || 'http';
//     hostUrl = `${protocol}://${host}`;
//   } else if (typeof location !== 'undefined') {
//     host = location.host;
//     protocol = location.protocol;
//     hostUrl = `${protocol}//${host}`;
//   }

//   const uri = `${hostUrl}/api`;

//   // Add authorization header from cookie if it exists
//   const authLink = setContext((_, { headers }) => {
//     const token = cookies(ctx).get('token');

//     return {
//       headers: {
//         ...headers,
//         authorization: token ? `Bearer ${token}` : '',
//       },
//     };
//   });

//   const httpLink = new HttpLink({
//     uri,
//     credentials: 'same-origin',
//     fetch,
//   });

//   return new ApolloClient({
//     ssrMode: Boolean(ctx),
//     link: authLink.concat(httpLink),
//     cache: new InMemoryCache().restore(initialState),
//   });
// }
