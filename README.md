<p align="center" style="text-align:center">
  <img alt="Bison Logo" src="https://user-images.githubusercontent.com/14339/89243835-f47e7c80-d5d2-11ea-8d8d-36202227d0ec.png" />
  <h1 align="center">The Full Stack JAMstack in-a-box.</h1>
</p>

Bison is a starter repository created out of real-world apps at [Echobind](https://echobind.com). It represents our team's "Greenfield Web Stack" that we use when creating web apps for clients.

We're always improving on this, and we welcome suggestions from the community!

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

- To reduce complexity, Bison avoids yarn workspaces and separate top-level folders. Think of your app like a traditional monolith, but with a separate frontend and API. This means that folders may be a little more intermingled than you're used to.
- Currently, Bison only works on Vercel. We plan to add support for Netlify soon.

## Alternatives

A few other projects that are rapidly maturing in the Full Stack JAMStack space.

**RedwoodJS**
[Redwood](https://github.com/redwoodjs/redwood) is a very promising framework that we're watching. We took the concept of "Cells" directly from Redwood (though admittedly our version takes a bit more code!)

**Blitz.js**
[Blitz](https://github.com/blitz-js/blitz) is also very promising. Blitz is built on Next.js (which we love!) and takes a very different approach by attempting to remove the API layer using conventions provided by Next.js.

We may borrow concepts from Redwood and Blitz over time or even switch to one as they continue to mature.

Think of Bison as a bit closer to the metal and preconfigured for maximum DX and efficiency. The good news is, if you disagree with any of the choices that we've made, nothing is hidden from you. You're welcome to adapt the "framework" to fit your needs.

---

# Getting Started

Create a new repo from the Bison template.

Using yarn:

```sh
yarn create bison-app MyApp
```

Using npx:

```sh
npx create-bison-app MyApp
```

## Setup the database

1. Setup a database locally (Postgres is the only type fully supported right now)
1. Make sure your database user has permission to create schemas and databases. We recommend using a superuser account locally to keep things easy.
1. Setup your local database with `yarn db:setup`. You'll be prompted to create it if it doesn't already exist:

![Prisma DB Create Prompt](https://user-images.githubusercontent.com/14339/88480536-7e1fb180-cf24-11ea-85c9-9bed43c9dfe4.png)

## Run the app locally

From the root, run `yarn dev`. This:

- runs `next dev` to run the frontend and serverless functions locally
- starts a watcher to generate the Prisma client on schema changes
- starts a watcher to generate TypeScript types for GraphQL files

## Next Steps

After the app is running locally, you'll want to [set up deployment](./docs/deployment.md) and [CI](./docs/ci.md)

# Docs

- [Recommended Dev Workflow](./docs/devWorkflow.md)
- [Deployment](./docs/deployment.md)
- [CI Setup](./docs/ci.md)
- [FAQ](./docs/faq.md)

Have an idea to improve Bison? [Let us know!](https://github.com/echobind/bisonapp/issues/new)

<hr style="margin-top: 120px" />

### About Echobind

Echobind is a full-service digital agency that creates web and mobile apps for clients across a variety of industries.

We're experts in React, React Native, Node, GraphQL, and Rails.

If you're building a new app, your team is tackling a hard problem, or you just need help getting over the finish line, we'd love to work with you. [Say hello](https://echobind.com/contact) and tell us what you're working on.

<p align="center" style="margin-top:40px">
  <a href="https://echobind.com" target="_blank">
    <img src="https://user-images.githubusercontent.com/14339/80931246-808bc880-8d86-11ea-9de5-39203d3ed5f5.png" alt="Echobind Logo">
  </a>
</p>
