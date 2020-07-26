# Setup

## Configure to Deploy on Vercel

1. run `vercel` or `vc`
1. choose the appropriate scope / organization
1. keep all the build defaults

### Deploy an existing project

1. Choose "link to an existing project" when prompted
1. Run `vercel env pull`. This will sync your dev env vars and save them to .env.

## Setup Prisma

1. Add an .env file to `api/prisma` and copy your . It will look something like this: `DATABASE_URL="postgresql://postgres@localhost:5432/myapp_dev?schema=public&connection_limit=1"`. Be sure and change the database name from myapp_dev
1. Migrate the database with `yarn db:migrate`. You'll be prompted to create the database if it doesn't exist.

# Run the app

From the root, run `yarn dev`. This will do the following:

- run `vercel dev` to run the frontend and serverless functions locally
- start a watcher to generate the Prisma client on schema changes
- start a watcher to generate TypeScript types for graphql files
