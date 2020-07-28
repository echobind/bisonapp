# Setup

## Configure Vercel

1. run `vercel` or `vc`
1. choose the appropriate scope / organization. If you don't see the organization, ask someone to invite you.
1. If this is a new project, keep all the build defaults. If this is an existing project, choose "link to an existing project" when prompted.
1. Run `vercel env pull`. This will sync your dev env vars and save them to .env.

## Configure Prisma

1. Add an .env file to `api/prisma` and copy your . It will look something like this: `DATABASE_URL="postgresql://postgres@localhost:5432/myapp_dev?schema=public&connection_limit=1"`. Be sure and change the database name from myapp_dev to whatever you want the name of your local database to be.
1. Migrate the database with `yarn db:migrate`. You'll be prompted to create the database if it doesn't exist:

![Prisma DB Create Prompt](https://user-images.githubusercontent.com/14339/88480536-7e1fb180-cf24-11ea-85c9-9bed43c9dfe4.png)

# Run the app

From the root, run `yarn dev`. This will do the following:

- run `vercel dev` to run the frontend and serverless functions locally
- start a watcher to generate the Prisma client on schema changes
- start a watcher to generate TypeScript types for graphql files

# FAQ

## Where are the generated nexus types?

`node_modules/@types/nexus-typegen`. To use these in your code, import like so:

```ts
import { NexusGenRootTypes } from 'graphql-nexus';

const user: NexusGenRootTypes['User'];
```

This will be a fully typed user according to the fields exposed on the GraphQL API.

## My types aren't working, even though Nexus is generating them

Try reopening VSCode.
