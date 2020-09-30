# Recommended Dev Workflow

You're not required to follow this exact workflow, but we've found it gives a good developer experience.

We start from the API and then create the frontend. The reason for this is that Bison will generate types for your GraphQL operations which you will leverage in your components on the frontend.

## API

### Generate a new GraphQL module

To generate a new GraphQL module we can run the command `yarn g:graphql MODULE_NAME`, replacing MODULE_NAME with the name of your module. In our example, we'll be using the concept of an `Organization`.

```shell
yarn g:graphql organization
```

This should output something like:

```shell
yarn run v1.22.10
$ hygen graphql new --name organization

Loaded templates: _templates
       added: graphql/organization.ts
      inject: graphql/schema.ts
✨  Done in 0.34s.
```

### Update your Prisma schema

Using our "organization" module example from the last step, we need to update `schema.prisma` with our data model:

```javascript
// prisma/schema.prisma

model Organization {
  id String @id @default(cuid())
  name String
  userId String
  user User @relation(fields: [userId], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

In our example a User has many Organizations, so we need to update our User model as well to reflect this relationship:

```javascript
// prisma/schema.prisma

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  roles     Role[]
  profile   Profile?
  organizations Organization[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

Note that we have defined `organizations` as `Organization[]`.

### Run your migrations

This is currently a two step process, 1) generate the migration and 2) execute the migration

**Generate the migration**

```shell
yarn g:migration
```

**Execute the migration**

```shell
yarn db:migrate
```

## Write a type, query, input, or mutation using [Nexus](https://nexusjs.org/guides/schema)

```
# TODO
```

## Create a new request test

```shell
yarn g:test:request
```

## Run `yarn test` to start the test watcher

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
