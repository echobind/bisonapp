# Recommended Dev Workflow

You're not required to follow this exact workflow, but we've found it gives a good developer experience.

We start from the API and then create the frontend. The reason for this is that Bison will infer types for your API procedures which you will leverage in your components on the frontend.

## API

### Generate a new tRPC router

To generate a new tRPC router we can run the command `yarn g:trpc ROUTER_NAME`, replacing ROUTER_NAME with the name of your router. In our example, we'll be using the concept of an `Organization`.

```shell
yarn g:trpc organization
```

This should output something like:

```shell
yarn run v1.22.10
$ hygen trpc new --name organization

Loaded templates: _templates
       added: server/routers/organization.ts
      inject: server/routers/_app.ts
      inject: server/routers/_app.ts
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

### Generate and execute the migration

```shell
yarn db:migrate
```

If you want to create the migration without executing it, run

```shell
yarn db:migrate --create-only
```

## Write a query or mutation using [tRPC](https://trpc.io)

[See tRPC Examples](./trpc-examples.md)

## Create a new request test

```shell
yarn g:test:request
```

## Run `yarn test` to start the test watcher

Add tests cases and update tRPC code accordingly.

## Frontend

1. Generate a new page using `yarn g:page`
1. Generate a new component using `yarn g:component`
1. If you need to fetch data in your component, use a cell. Generate one using `yarn g:cell`
1. Use the hooks from tRPC, such as `trpc.user.signup.useMutation()`. You'll now have a fully typed response to work with!

```tsx
import { trpc, inferQueryOutput } from '@/lib/trpc';

// an example of inferring the output of a query
function noIdea(user: Partial<inferQueryOutput<"user","me">>) {
  console.log(user.email);
}

function fakeCell() {
  // use the generated hook
  const { data, isLoading, isError } = trpc.user.me.useQuery();

  if (isLoading) return <Loading />;

  // data will be fully typed
  return <Success user={data}>
}
```

### Request Spec Examples

[Request Spec Examples](./request-spec-examples.md)
