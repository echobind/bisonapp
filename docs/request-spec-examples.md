# Request Spec Examples

When generating a tRPC module w/ `yarn g:trpc` the basic boilerplate will generate for Find, List, Create, and Update.
Below is an example of testing each with a `Skill` module example:

<details>
<summary> Generated Skill Module </summary>

```typescript
import { Prisma } from '@prisma/client';
import { z } from 'zod';

import { t } from '@/server/trpc';
import { adminProcedure, protectedProcedure } from '@/server/middleware/auth';

// Skill default selection
export const defaultSkillSelect = Prisma.validator<Prisma.SkillSelect>()({
  id: true,
  createdAt: true,
  updatedAt: true,
  name: true,
});

export const skillRouter = t.router({
  skills: protectedProcedure
    .input(
      z.object({
        where: z.object({ name: z.string().optional() }).optional(),
        orderBy: z
          .object({ name: z.enum(['asc', 'desc']) })
          .array()
          .optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { where = {}, orderBy = [] } = input;
      return await ctx.db.skill.findMany({
        where,
        orderBy,
        select: defaultSkillSelect,
      });
    }),
  skill: protectedProcedure
    .input(z.object({ where: z.object({ id: z.string() }) }))
    .query(async ({ ctx, input }) => {
      const { where } = input;
      return ctx.prisma.skill.findUnique({ where, select: defaultSkillSelect });
    }),
  createSkill: adminProcedure
    .input(z.object({ data: z.object({ name: z.string() }) }))
    .mutation(async ({ ctx, input }) => {
      const { data } = input;
      return await ctx.db.skill.create({ data, select: defaultSkillSelect });
    }),
  updateSkill: adminProcedure
    .input(
      z.object({
        where: z.object({ id: z.string() }),
        data: z.object({ name: z.string() }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { where, data } = input;

      return await ctx.db.skill.update({
        where,
        data,
        select: defaultSkillSelect,
      });
    }),
});
```

</details>

## Find Skill

<details>
<summary>File: request/skill/skill.ts</summary>

```typescript
import { Role } from '@prisma/client';

import { resetDB, disconnect, trpcRequest } from '../../helpers';
import { UserFactory } from '../../factories/user';
import { SkillFactory } from '../../factories/skill';

beforeEach(async () => resetDB());
afterAll(async () => disconnect());

describe('skill query', () => {
  describe('as Role User', () => {
    it('can query other Skill', async () => {
      const user = await UserFactory.create({ roles: [Role.USER] });

      const record = await SkillFactory.create();
      const variables = { where: { id: record.id } };

      const skill = await trpcRequest(user).skill.createSkill(variables);

      expect(skill.id).not.toBeNull();
      expect(skill.name).toEqual(record.name);
    });
  });

  describe('as Role ADMIN', () => {
    it('can query a skill', async () => {
      const admin = await UserFactory.create({ roles: { set: [Role.ADMIN] } });
      const record = await SkillFactory.create();
      const variables = { where: { id: record.id } };

      const skill = await trpcRequest(admin).skill.createSkill(variables);

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

import { resetDB, disconnect, trpcRequest } from '../../helpers';
import { UserFactory } from '../../factories/user';
import { SkillFactory } from '../../factories/skill';

beforeEach(async () => resetDB());
afterAll(async () => disconnect());

describe('skills query', () => {
  describe('not logged in', () => {
    it('returns a Not Authorized error', async () => {
      await expect(trpcRequest().skill.skills()).rejects.toThrowErrorMatchingInlineSnapshot(
        `"UNAUTHORIZED"`
      );
    });
  });

  describe('As Role Admin', () => {
    it('Can Query Skill', async () => {
      const admin = await UserFactory.create({ roles: [Role.ADMIN] });
      const record = await SkillFactory.create({ name: 'TODO' });
      const record2 = await SkillFactory.create({ name: 'ASDF' });

      const variables = { where: {} };
      const skills = await trpcRequest(admin).skill.skills(variables);

      expect(skills.map(({ id, name }) => ({ id, name }))).toMatchObject([
        { id: record.id, name: 'TODO' },
        { id: record2.id, name: 'ASDF' },
      ]);
    });
  });

  describe('As Role User', () => {
    it('Can Query Skill', async () => {
      const user = await UserFactory.create({ roles: [Role.USER] });
      const record = await SkillFactory.create({ name: 'TODO' });
      const record2 = await SkillFactory.create({ name: 'ASDF' });

      const variables = { where: {} };
      const skills = await trpcRequest(user).skill.skills(variables);

      expect(skills.map(({ id, name }) => ({ id, name }))).toMatchObject([
        { id: record.id, name: 'TODO' },
        { id: record2.id, name: 'ASDF' },
      ]);
    });

    it('Can Filter Skill', async () => {
      const user = await UserFactory.create({ roles: [Role.USER] });
      const record = await SkillFactory.create({ name: 'TODO' });
      await SkillFactory.create({ name: 'ASDF' });

      // TODO: Update with SkillWhereInput! use case
      const variables = { where: { name: record.name } };
      const skills = await trpcRequest(user).skill.skills(variables);

      expect(skills.map(({ id, name }) => ({ id, name }))).toMatchObject([
        { id: record.id, name: 'TODO' },
      ]);
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

import { resetDB, disconnect, trpcRequest } from '../../helpers';
import { UserFactory } from '../../factories/user';

beforeEach(async () => resetDB());
afterAll(async () => disconnect());

describe('Skill createSkill mutation', () => {
  describe('As a Role User', () => {
    it('returns Not Authorized', async () => {
      const user = await UserFactory.create({ roles: [Role.USER] });

      // Insert SkillCreateInput!
      const variables = { data: { name: 'TODO' } };

      await expect(
        trpcRequest(user).skill.createSkill(variables)
      ).rejects.toThrowErrorMatchingInlineSnapshot(`"UNAUTHORIZED"`);
    });
  });

  describe('As Role ADMIN', () => {
    it('can create a skill', async () => {
      const admin = await UserFactory.create({ roles: [Role.ADMIN] });

      const variables = { data: { name: 'TODO' } };
      const skill = await trpcRequest(user).skill.createSkill(variables);

      expect(skill.id).not.toBeNull();
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

import { resetDB, disconnect, trpcRequest } from '../../helpers';
import { UserFactory } from '../../factories/user';
import { SkillFactory } from '../../factories/skill';

beforeEach(async () => resetDB());
afterAll(async () => disconnect());

describe('Skill updateSkill mutation', () => {
  describe('As a Role User', () => {
    it('returns Not Authorized', async () => {
      const user = await UserFactory.create({ roles: [Role.USER] });
      await SkillFactory.create({ name: 'TODO' });

      const variables = {
        where: { name: 'TODO' },
        data: { name: 'UPDATED' },
      };

      await expect(
        trpcRequest(user).skill.updateSkill(variables)
      ).rejects.toThrowErrorMatchingInlineSnapshot(`"UNAUTHORIZED"`);
    });
  });

  describe('As Role ADMIN', () => {
    it('can update a skill', async () => {
      const admin = await UserFactory.create({ roles: [Role.ADMIN] });
      await SkillFactory.create({ name: 'TODO' });

      const variables = {
        where: { name: 'TODO' },
        data: { name: 'UPDATED' },
      };

      const skill = await trpcRequest(admin).skill.updateSkill(variables);

      expect(skill.name).toEqual('UPDATED');
    });
  });
});
```

</details>

## Auto-Generating specs with `yarn g:trpc`

If you find yourself creating these often, you may wish to add template files the trpc template folder. See Closed PR for an example (this uses GraphQL, but the principle is the same): [https://github.com/echobind/bisonapp/pull/186](https://github.com/echobind/bisonapp/pull/186)
