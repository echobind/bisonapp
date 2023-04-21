<p align="center" style="text-align:center">
  <img alt="Bison Logo" src="https://user-images.githubusercontent.com/14339/89243835-f47e7c80-d5d2-11ea-8d8d-36202227d0ec.png" />
  <h1 align="center">The Full Stack Jamstack in-a-box</h1>
</p>

Bison is a starter repository created out of real-world apps at [Echobind](https://echobind.com). It represents our team's "Greenfield Web Stack" that we use when creating web apps for clients.

We're always improving on this, and we welcome suggestions from the community!

## Technology

- [Next.js](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [tRPC](https://trpc.io) API for end-to-end type safety
- [Prisma](https://www.prisma.io/) w/ Postgres
- [Tailwind](https://tailwindcss.com/)
- [React Hook Form](https://react-hook-form.com/)
- [Playwright](https://www.playwright.dev/) for E2E tests
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro) and [Jest](https://jestjs.io/) for unit and API request tests

## Features

- Customizable [Hygen Templates](https://www.hygen.io/) to generate new files
- Fully wired up login/signup pages with client and server-side validation.
- Eslint pre-configured with [Echobind best practices](https://github.com/echobind/eslint-plugin-echobind)
- Import path alias to the root project folder (`@/`) to avoid the need for long relative import paths.
- Set up for components from [ui.shadcn.com](https://ui.shadcn.com)

## Conventions

- Don't copy/paste files, use generators and Hygen templates. Need to update the generator as your project evolves? they are all in the `_templates` folder.
- Don't manually write types for tRPC procedures. Infer the types from the router definition.
- All frontend pages are static by default. If you need something server rendered, just add `getServerSideProps` like you would in any Next app.
- Instead of creating component CSS classes (like `.btn` or `.input`) or installing a component library, UI components should be copy/pasted into the `/components/ui` folder and adjusted as needed. [ui.shadcn.com](https://ui.shadcn.com) is the recommended source for these components.

## Tradeoffs

- To reduce complexity, Bison avoids yarn workspaces and separate top-level folders. Think of your app like a traditional monolith, but with a separate frontend and API. This means that folders may be a little more intermingled than you're used to.

## Alternatives

A few other projects that are rapidly maturing in the Full Stack Jamstack space.

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

Please refer to: [Set up Postgres](/docs/postgres.md).

## Run the app locally

From the root, run `yarn dev`. This runs `next dev` to run the frontend and serverless functions locally.

## Next Steps

After the app is running locally, you'll want to [set up deployment](/docs/deployment.md).

# Docs

- [Recommended Dev Workflow](/docs/devWorkflow.md)
- [Deployment](/docs/deployment.md)

Have an idea to improve Bison? [Let us know!](https://github.com/echobind/bisonapp/issues/new)

<hr style="margin-top: 120px" />

### About Echobind

Echobind is a full-service digital agency that creates web and mobile apps for clients across a variety of industries.

We're experts in React, React Native, Node, GraphQL, and Rails.

If you're building a new app, your team is tackling a hard problem, or you just need help getting over the finish line, we'd love to work with you. [Say hello](https://echobind.com/contact) and tell us what you're working on!

<p align="center" style="margin-top:40px">
  <a href="https://echobind.com" target="_blank">
    <img src="https://user-images.githubusercontent.com/14339/80931246-808bc880-8d86-11ea-9de5-39203d3ed5f5.png" alt="Echobind Logo">
  </a>
</p>
