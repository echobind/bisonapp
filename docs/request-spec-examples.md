# Request Spec Examples

When generating a graphql module w/ `yarn g:graqhql` the basic boilerplate will generate for Find, List, Create, and Update.
Below is an example of testing each with a `Skill` module example:

<details>
<summary> Generated Skill Module </summary>

```typescript
import { objectType, inputObjectType, queryField, mutationField, arg, list, nonNull } from 'nexus';

import { isAdmin } from '../../services/permissions';

// Skill Type
export const Skill = objectType({
  name: 'Skill',
  description: 'A Skill',
  definition(t) {
    t.nonNull.id('id');
    t.nonNull.date('createdAt');
    t.nonNull.date('updatedAt');
    t.nonNull.string('name');
  },
});

// Queries
export const findSkillsQuery = queryField('skills', {
  type: list('Skill'),
  authorize: (_root, _args, ctx) => !!ctx.user,
  args: {
    where: arg({ type: 'SkillWhereInput' }),
    orderBy: arg({ type: 'SkillOrderByInput', list: true }),
  },
  description: 'Returns found skills',
  resolve: async (_root, args, ctx) => {
    const { where = {}, orderBy = [] } = args;

    return await ctx.db.skill.findMany({ where, orderBy });
  }
});

export const findUniqueSkillQuery = queryField('skill', {
  type: 'Skill',
  description: 'Returns a specific Skill',
  authorize: (_root, _args, ctx) => !!ctx.user,
  args: {
    where: nonNull(arg({ type: 'SkillWhereUniqueInput' }))
  },
  resolve: (_root, args, ctx) => {
    const { where } = args;
    return ctx.prisma.skill.findUnique({ where })
  },
});

// Mutations
export const createSkillMutation = mutationField('createSkill', {
  type: 'Skill',
  description: 'Creates a Skill',
  authorize: (_root, _args, ctx) => isAdmin(ctx.user),
  args: {
    data: nonNull(arg({ type: 'CreateSkillInput' })),
  },
  resolve: async (_root, args, ctx) => {
    return await ctx.db.skill.create(args);
  }
});

export const updateSkillMutation = mutationField('updateSkill', {
  type: 'Skill',
  description: 'Updates a Skill',
  authorize: (_root, _args, ctx) => isAdmin(ctx.user),
  args: {
    where: nonNull(arg({ type: 'SkillWhereUniqueInput'})),
    data: nonNull(arg({ type: 'UpdateSkillInput' })),
  },
  resolve: async (_root, args, ctx) => {
    const { where, data } = args;

    return await ctx.db.skill.update({ where, data });
  }
});

// MUTATION INPUTS
export const CreateSkillInput = inputObjectType({
  name: 'CreateSkillInput',
  description: 'Input used to create a skill',
  definition: (t) => {
    t.nonNull.string('name');
  },
});

export const UpdateSkillInput = inputObjectType({
  name: 'UpdateSkillInput',
  description: 'Input used to update a skill',
  definition: (t) => {
    t.nonNull.string('name');
  },
});

// QUERY INPUTS
export const SkillOrderByInput = inputObjectType({
  name: 'SkillOrderByInput',
  description: 'Order skill by a specific field',
  definition(t) {
    t.field('name', { type: 'SortOrder' });
  },
});

export const SkillWhereUniqueInput = inputObjectType({
  name: 'SkillWhereUniqueInput',
  description: 'Input to find skills based on unique fields',
  definition(t) {
    t.id('id');
    // add DB uniq fields here
    // t.string('name');
  },
});

export const SkillWhereInput = inputObjectType({
  name: 'SkillWhereInput',
  description: 'Input to find skills based on other fields',
  definition(t) {
    t.field('name', { type: 'StringFilter' });
  },
});

```

</details>

## Find Skill

<details>
<summary>File: request/skill/skill.ts</summary>

```typescript
import { Role } from '@prisma/client';

import { resetDB, disconnect, graphQLRequestAsUser } from '../../helpers';
import { UserFactory } from '../../factories/user';
import { SkillFactory } from '../../factories/skill';

beforeEach(async () => resetDB());
afterAll(async () => disconnect());

describe('skill query', () => {
  describe('as Role User', () => {
    it('can query other Skill', async () => {
      const query = `
        query skill($where: SkillWhereUniqueInput!) {
          skill( where: $where ) {
            id
            name
          }
        }
      `;

      const user = await UserFactory.create({ roles: [Role.USER] });

      const record = await SkillFactory.create();
      const variables = { where: { id: record.id } };

      const response = await graphQLRequestAsUser(user, { query, variables });

      const { skill } = response.body.data;

      expect(skill.id).not.toBeNull();
      expect(skill.name).toEqual(record.name);
      expect('Update Generated Test').toBeNull();
    });
  });

  describe('as Role ADMIN', () => {
    it('can query a user email', async () => {
      const query = `
        query skill($where: SkillWhereUniqueInput!) {
          skill( where: $where ) {
            id
            name
          }
        }
      `;

      const admin = await UserFactory.create({ roles: { set: [Role.ADMIN] } });
      const record = await SkillFactory.create();
      const variables = { where: { id: record.id } };

      const response = await graphQLRequestAsUser(admin, { query, variables });

      const { skill } = response.body.data;

      expect(skill.id).not.toBeNull();
      expect(skill.name).toEqual(record.name);
      expect('Update Generated Test').toBeNull();
    });
  });
});

```

</details>

## List Skill

<details>
<summary>File: request/skill/skills.ts</summary>

```typescript
import { Role } from '@prisma/client';

import { resetDB, disconnect, graphQLRequestAsUser, graphQLRequest } from '../../helpers';
import { UserFactory } from '../../factories/user';
import { SkillFactory } from '../../factories/skill';

beforeEach(async () => resetDB());
afterAll(async () => disconnect());

describe('skills query', () => {
  describe('not logged in', () => {
    it('returns a Not Authorized error', async () => {
      const query = `
        query skills {
          skills {
            id
            name
          }
        }
      `;

      const response = await graphQLRequest({ query });
      const errorMessages = response.body.errors.map((e) => e.message);

      expect(errorMessages).toEqual(['Not authorized']);
    });
  });

  describe('As Role Admin', () => {
    it('Can Query Skill', async () => {
      const query = `
        query skills($where: SkillWhereInput!) {
          skills(where: $where) {
            id
            name
          }
        }
      `;

      const admin = await UserFactory.create({ roles: [Role.ADMIN] });
      const record = await SkillFactory.create({ name: 'TODO' });
      const record2 = await SkillFactory.create({ name: 'ASDF' });

      const variables = { where: {} };
      const response = await graphQLRequestAsUser(admin, { query, variables });

      expect(response.body.data.skills).toMatchObject([
        { id: record.id, name: 'TODO' },
        { id: record2.id, name: 'ASDF' },
      ]);

      expect('Updated Generated Test').toBeNull();
    });
  });

  describe('As Role User', () => {
    it('Can Query Skill', async () => {
      const query = `
        query skills($where: SkillWhereInput!) {
          skills(where: $where) {
            id
            name
          }
        }
      `;

      const user = await UserFactory.create({ roles: [Role.USER] });
      const record = await SkillFactory.create({ name: 'TODO' });
      const record2 = await SkillFactory.create({ name: 'ASDF' });

      const variables = { where: {} };
      const response = await graphQLRequestAsUser(user, { query, variables });

      expect(response.body.data.skills).toMatchObject([
        { id: record.id, name: 'TODO' },
        { id: record2.id, name: 'ASDF' },
      ]);

      expect('Updated Generated Test').toBeNull();
    });

    it('Can Filter Skill', async () => {
      const query = `
        query skills($where: SkillWhereInput!) {
          skills(where: $where) {
            id
            name
          }
        }
      `;

      const user = await UserFactory.create({ roles: [Role.USER] });
      const record = await SkillFactory.create({ name: 'TODO' });
      await SkillFactory.create({ name: 'ASDF' });

      // TODO: Update with SkillWhereInput! use case
      const variables = { where: { name: record.name } };
      const response = await graphQLRequestAsUser(user, { query, variables });

      expect(response.body.data.skills).toMatchObject([{ id: record.id, name: 'TODO' }]);
      expect('Updated Generated Test').toBeNull();
    });
  });
});

```

</details>

## Create Skill

<details>
<summary>File: request/skill/createSkill.ts</summary>

```typescript
import { Role } from '@prisma/client';

import { resetDB, disconnect, graphQLRequestAsUser } from '../../helpers';
import { UserFactory } from '../../factories/user';

beforeEach(async () => resetDB());
afterAll(async () => disconnect());

describe('Skill createSkill mutation', () => {
  describe('As a Role User', () => {
    it('returns Not Authorized', async () => {
      const query = `
        mutation createSkill($data: SkillCreateInput!) {
          createSkill(data: $data) {
            id
          }
        }
      `;

      const user = await UserFactory.create({ roles: [Role.USER] });

      // Insert SkillCreateInput!
      const variables = { data: { name: 'TODO' } };

      const response = await graphQLRequestAsUser(user, { query, variables });
      const errorMessages = response.body.errors.map((e) => e.message);

      expect(errorMessages).toMatchInlineSnapshot(`
        Array [
          "Not authorized",
        ]
      `);

      expect('Update Generated Test').toBeNull();
    });
  });

  describe('As Role ADMIN', () => {
    it('can create a skill', async () => {
      const query = `
        mutation createSkill($data: SkillCreateInput!) {
          createSkill(data: $data) {
            id
          }
        }
      `;

      const admin = await UserFactory.create({ roles: [Role.ADMIN] });

      const variables = { data: { name: 'TODO' } };

      const response = await graphQLRequestAsUser(admin, { query, variables });
      const errorMessages = response.body.errors.map((e) => e.message);
      const { createSkill } = response.body.data;

      expect(errorMessages).toBeNull();
      expect(createSkill.id).not.toBeNull();
      expect('Update Generated Test').toBeNull();
    });
  });
});
```

</details>

## Update Skill

<details>
<summary>File: request/skill/updateSkill.ts</summary>

```typescript
import { Role } from '@prisma/client';

import { resetDB, disconnect, graphQLRequestAsUser } from '../../helpers';
import { UserFactory } from '../../factories/user';
import { SkillFactory } from '../../factories/skill';

beforeEach(async () => resetDB());
afterAll(async () => disconnect());

describe('Skill updateSkill mutation', () => {
  describe('As a Role User', () => {
    it('returns Not Authorized', async () => {
      const query = `
        mutation updateSkill($data: SkillUpdateInput!) {
          updateSkill(data: $data) {
            id
          }
        }
      `;

      const user = await UserFactory.create({ roles: [Role.USER] });
      await SkillFactory.create({ name: 'TODO' });

      //TODO: Insert SkillUpdateInput! use case
      const variables = {
        where: { name: 'TODO' },
        data: { name: 'UPDATED' },
      };

      const response = await graphQLRequestAsUser(user, { query, variables });
      const errorMessages = response.body.errors.map((e) => e.message);

      expect(errorMessages).toMatchInlineSnapshot(`
        Array [
          "Not authorized",
        ]
      `);

      expect('Update Generated Test').toBeNull();
    });
  });

  describe('As Role ADMIN', () => {
    it('can update a skill', async () => {
      const query = `
        mutation updateSkill($data: SkillUpdateInput!) {
          updateSkill(data: $data) {
            id
          }
        }
      `;

      const admin = await UserFactory.create({ roles: [Role.ADMIN] });
      await SkillFactory.create({ name: 'TODO' });

      const variables = {
        where: { name: 'TODO' },
        data: { name: 'UPDATED' },
      };

      const response = await graphQLRequestAsUser(admin, { query, variables });
      const errorMessages = response.body.errors.map((e) => e.message);
      const { updateSkill } = response.body.data;

      expect(errorMessages).toBeNull();
      expect(updateSkill.name).toEqual('UPDATED');
      expect('Update Generated Test').toBeNull();
    });
  });
});

```

</details>

## Auto-Generating specs with `yarn g:graphql`

If you find yourself creating these often, you may wish to add template files the graphql template folder. See Closed PR for an example: [https://github.com/echobind/bisonapp/pull/186](https://github.com/echobind/bisonapp/pull/186)
