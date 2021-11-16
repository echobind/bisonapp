# Seeds and Scripts

## Seeds

### Dev VS Prod

- `yarn db:seed` (DEV)
- `yarn db:seed:prod` (PROD)

We use `APP_ENV` in the scripts to determine the dataset returned for seeds.
This ENV is set in your .env.local file as well, and can be manually set as an ENV in your deploy environment if needed for other scripts.

### File Breakdown (Seeds)

```sh
/seeds
--/model
----/data.ts
----/prismaRunner.ts
----/index.ts
```

**data.ts** contains the exported function `seedModelData: ModelCreateInput[]` this function leverages APP_ENV to return the dataset expected for Dev vs Prod. In the case of `users` this returns `initialDevUsers: UserCreateInput[]` or `initalProdUsers: UserCreateInput[]`.

**prismaRunner.ts** this file contains the Prisma `UPSERT` call for the model. We leverage upsert here so that seeds can potentially be ran more than once as your models and data expand over time.

**index.ts** export of functions for main seed file

### Relationships

In the event your model has a relationship dependency ie. Accounts, Organizations, etc. The prismaRunners are set to return a `Pick<Model, 'id'>` result for you to leverage in future seeds. The dependent runner would expand to take these parameters.

**User/Organization example:**

```ts
  import {orgSeedData, seedOrganizations } from './seeds/organizations';
  import {userSeedData, seedUsers } from './seeds/users';

  const [{ id: orgId }] = await seedOrganizations(orgSeedData);
  await seedUsers(userSeedData(orgId));
```

```ts
  const initialDevUsers = (orgId: string): UserCreateInput[] => [
    {
      email: 'john.doe@echobind.com',
      organization: { connect: { id: orgId } },
      // ...other create data
    }
  ]
```

## Scripts

### File Breakdown (Scripts)

```sh
/scripts
--/run.ts
--/exampleUserScript.ts
```

**run.ts** This is the main run file leveraged by `yarn run:script {filename}`.
This script takes a file name to be run via `commander`. These scripts can be ANYTHING. However, in our example, we've leveraged the same `seedUsers` runner to add new employees.

**exampleUserScript.ts** This is an example script file that can be ran with `yarn run:script exampleUserScript.ts`. This script leverages the same `seedUsers` prisma runner to add a few new employees to the team.
