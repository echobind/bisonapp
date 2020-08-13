<p align="center" style="text-align:center">
  <img alt="Bison Logo" src="https://user-images.githubusercontent.com/14339/89243835-f47e7c80-d5d2-11ea-8d8d-36202227d0ec.png" />
  <h1 align="center">The Full Stack JAMstack in-a-box.</h1>
</p>

Bison is a starter repository created out of real-world apps at [Echobind](https://echobind.com). It represents our current "Greenfield Web Stack" that we use when creating web apps for clients.

We're always improving on this, and welcome suggestions from the community!

## Technology

- [Next.js](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- GraphQL API built with [Nexus](https://nexusjs.org/)
- [Prisma](https://www.prisma.io/) w/ Postgres
- [GraphQL Codegen](https://graphql-code-generator.com/) to generate TypeScript types (Schema types and query/mutation hooks)
- [Chakra UI](https://chakra-ui.com/)
- [React Hook Form](https://react-hook-form.com/)
- [Cypress](https://www.cypress.io/) for E2E tests
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro) and [Jest](https://jestjs.io/) for unit and API request tests

## Features

- Preconfigured for CI using [GitHub Actions](https://github.com/features/actions)
- Customizable [Hygen Templates](https://www.hygen.io/) to generate new files
- Fully wired up login/signup pages with client and server-side validation.
- Eslint pre-configured with [Echobind best practices](https://github.com/echobind/eslint-plugin-echobind)
- Pre-configured for deployment on [Vercel](https://vercel.io) with customizable branch workflow.

## Conventions

- Don't copy/paste files, use generators and Hygen templates. Need to update the generator as your project evolves? they are all in the `_templates` folder.
- Use a single command to run Next, generate Nexus types, and GraphQL types for the frontend. By doing this you can ensure your types are always up-to-date.
- Don't manually write types for GraphQL responses... use the generated query hooks from GraphQL Codegen.
- All frontend pages are static by default. If you need something server rendered, just add `getServerSideProps` like you would in any Next app.

## Tradeoffs

- To reduce complexity, Bison avoids yarn workspaces and separate top-level folders. Think of your app a bit more like a traditional monolith, but with a separate frontend and API. This means that folders may be a little more "intermingled" than your used to.
- Currently, Bison only works on Vercel. We plan to add support for Netlify soon.

## Alternatives

There are a few other projects that are rapidly maturing in the Full Stack JAMStack space.

**RedwoodJS**
Redwood is a very promising framework we've got our eye on. We took the concept of "Cells" directly from Redwood (though admittedly our version takes a bit more code!).

**Blitz.js**
Blitz is also very promising. Blitz is built on Next.js (which we love!) and takes a very different approach by attempting to "remove" the API layer using conventions provided by Next.js.

We may borrow concepts from Redwood and Blitz over time, and could even switch to one in the future as things continue to mature.

Think of Bison as a bit closer to the metal, but preconfigured for maximum DX and efficiency. The good news is, if you disagree with any of the choices we've made, nothing is hidden from you and you're welcome to adapt the "framework" to fit your needs.

---

# Getting Started

Create a new repo fom the Bison template.

Using yarn:

```sh
yarn create bison-app MyApp
```

Using npx:

```sh
npx create-bison-app MyApp
```

## Migrate the database

1. Migrate the database with `yarn db:migrate`. You'll be prompted to create the database if it doesn't exist:

![Prisma DB Create Prompt](https://user-images.githubusercontent.com/14339/88480536-7e1fb180-cf24-11ea-85c9-9bed43c9dfe4.png)

If you'd like to change the database name or schema, change the DATABASE_URL in `prisma/.env`.

# Run the app locally

From the root, run `yarn dev`. This will do the following:

- run `vc dev` to run the frontend and serverless functions locally
- start a watcher to generate the Prisma client on schema changes
- start a watcher to generate TypeScript types for GraphQL files

# Recommended Dev Workflow

You're not required to follow this exact workflow, but we've found it gives a good developer experience.

## API

1. Generate a new GraphQL module using `yarn g:graphql`.
1. Write a type, query, input, or mutation using [Nexus](https://nexusjs.org/guides/schema)
1. Create a new request test using `yarn g:test:request`
1. Run `yarn test` to start the test watcher
1. Add tests cases and update schema code accordingly
1. The GraphQL playground (localhost:3000/api/graphql) can be helpful to form the proper queries to use in tests.
1. `types.ts` and `api.graphql` should update automatically as you change files. Sometimes it's helpful to open these as a sanity check before moving on to the frontend code.

## Frontend

1. Generate a new page using `yarn g:page`
1. Generate a new component using `yarn g:component`
1. If you need to fetch data in your component, use a cell. Generate one using `yarn g:cell` (TODO)
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

5. Use the newly generated types from codegen instead of the typical `useQuery` or `useMutation` hook. For the example above, that would be `useSignupMutation`. You'll now have a fully typed response to work with!

```tsx
import { User, useMeQuery } from './types';

// adding this will auto-generate a custom hook in ./types
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

function fakeComponent() {
  // use the generated hook
  const { data, loading, error } = useMeQuery();

  if (loading) return <Loading />;

  // data.user will be fully typed
  return <Success user={data.user}>
}
```

# Set up CI

This project uses GitHub Actions for CI and should work out of the box. Note, as you add ENV vars to your app, you'll want to also add them in GitHub Secrets.

Easiest CI configuration ever, right?

# Setup Preview / Production Deployments

To ensure your project can be deployed using GitHub Actions, you need to add a few ENV vars to GitHub Secrets:

![ENV Vars](https://user-images.githubusercontent.com/14339/89292945-228fab00-d62b-11ea-90c2-4198dfcf30f1.png)

The Vercel project and org id, can be copied from `.vercel/project.json`. You can generate a token from https://vercel.com/account/tokens.

After tests pass, the app will deploy to Vercel. By default, every push creates a preview deployment. Merging to the main branch will deploy to staging, and pushing to the production branch will deploy to production.

If you'd like to change these configurations, update the section below:

```
## For a typical JAMstack flow, this should be your default branch.
## For a traditional flow that auto-deploys staging and deploys prod is as needed, keep as is
if: github.ref != 'refs/heads/production' # every branch EXCEPT production
```

# FAQ

## Where are the generated types?

TypeScript Types for GraphQL types, queries, and mutations are generated automatically and placed in `./types.ts`.

## VSCode can't find new types, even though they are in ./types.ts

Try reopening VSCode.
