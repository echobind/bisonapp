# FAQ

## Where can I find the generated GraphQL schema, React hooks, and typings?

- Types and hooks for GraphQL queries and mutations will be generated in `./types.ts`. You can run `yarn codegen` to generate this file.
- Types for [Nexus](https://nexusjs.org/) will be generated in `./types/nexus.d.ts` and the GraphQL schema will be generated in `./api.graphql`. You can run `yarn build:nexus` to generate these files.

When running the dev server, `yarn dev`, these types are automatically generated on file changes. You can also run `yarn build:types` to generate these files.

## Why can't VSCode find newly generated types, even though they are in the generated file?

Try reopening VSCode.
