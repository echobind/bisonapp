# Recommended Dev Workflow

You're not required to follow this exact workflow, but we've found it gives a good developer experience.

We start from the API and then create the frontend. The reason for this is that Bison will generate types for your GraphQL operations which you will leverage in your components on the frontend.

## API

1. Generate a new GraphQL module using `yarn g:graphql`.
1. Write a type, query, input, or mutation using [Nexus](https://nexusjs.org/guides/schema)
1. Create a new request test using `yarn g:test:request`
1. Run `yarn test` to start the test watcher
1. Add tests cases and update schema code accordingly. The GraphQL playground (localhost:3000/api/graphql) can be helpful to form the proper queries to use in tests.
1. `types.ts` and `api.graphql` should update automatically as you change files. Sometimes it's helpful to open these as a sanity check before moving on to the frontend code.

## Frontend

1. Generate a new page using `yarn g:page`
1. Generate a new component using `yarn g:component`
1. If you need to fetch data in your component, use a cell. Generate one using `yarn g:cell`
1. To generate a typed GraphQL query, simply add it to the component or page:

```ts
export const SIGNUP_MUTATION = gql`
  mutation signup($data: SignupInput!) {
    signup(data: $data) {
      token
      user {
        id
      }
    }
  }
`;
```

5. Use the newly generated hooks from Codegen instead of the typical `useQuery` or `useMutation` hook. For the example above, that would be `useSignupMutation`. You'll now have a fully typed response to work with!

```tsx
import { User, useMeQuery } from './types';

// adding this will auto-generate a custom hook in ./types.
export const ME_QUERY = gql`
  query me {
    me {
      id
      email
    }
  }
`;

// an example of taking a user as an argument with optional attributes
function noIdea(user: Partial<User>) {
  console.log(user.email);
}

function fakeCell() {
  // use the generated hook
  const { data, loading, error } = useMeQuery();

  if (loading) return <Loading />;

  // data.user will be fully typed
  return <Success user={data.user}>
}
```
