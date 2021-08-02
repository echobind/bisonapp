# Nexus Examples

## Disclaimer

This is not perfect and still a work in progress as we refine and iterate throughout our own applications. As Nexus and Prisma evolve so will these examples. :slight_smile:

Found a better pattern? Let us know and open a PR!

The goal here is to provide working examples of EB naming best practices, and relational nexus inputs that pair with Prisma.

- [Nexus Examples](#nexus-examples)
  - [Disclaimer](#disclaimer)
  - [Context](#context)
  - [Module References](#module-references)
  - [Module Definitions and Joins](#module-definitions-and-joins)
  - [Naming Conventions](#naming-conventions)
    - [Naming InputTypes](#naming-inputtypes)
    - [Naming Mutation Fields](#naming-mutation-fields)
    - [Naming Query Fields](#naming-query-fields)
  - [Shared Nexus Types](#shared-nexus-types)
  - [One to One](#one-to-one)
    - [Read/Filter (1-1)](#readfilter-1-1)
    - [Create (1-1)](#create-1-1)
    - [Update (1-1)](#update-1-1)
  - [One to Many](#one-to-many)
    - [Read/Filter (1-n)](#readfilter-1-n)
    - [Create (1-n)](#create-1-n)
    - [Update (1-n)](#update-1-n)
  - [Many To Many](#many-to-many)
    - [Read (n-n)](#read-n-n)
    - [Create (n-n)](#create-n-n)
    - [Update (n-n)](#update-n-n)

## Context

In this example doc, we'll follow along with the following prisma schema where:

- A user requires a profile (one-to-one)
- A User has many skills (many-to-many)
- A User has many posts (one-to-many)

<details>
<summary> Prisma Schema Example </summary>

```javascript
model Profile {
  id        String   @id @default(cuid())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  firstName String
  lastName  String
  user      User?
}

model User {
  id        String   @id @default(cuid())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  email     String   @unique

  profileId String
  profile   Profile  @relation(fields: [profileId], references: [id])
  skills    Skill[]
  posts     Post[]
}

model Skill {
  id          String   @id @default(cuid())
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  name        String   @unique
  description String?
  archived    Boolean  @default(false)
  users       User[]
}

model Post {
  id        String   @id @default(cuid())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  title     String   @unique
  body      String?
  userId    String
  user      User     @relation(fields: [userId], references: [id])
}

```

</details>

## Module References

<details>
<summary>
  Full Profile Module Example
</summary>

```typescript
import { inputObjectType, objectType } from 'nexus';

// Profile Type
export const Profile = objectType({
  name: 'Profile',
  description: 'A User Profile',
  definition(t) {
    t.nonNull.id('id');
    t.nonNull.date('createdAt');
    t.nonNull.date('updatedAt');
    t.nonNull.string('firstName');
    t.nonNull.string('lastName');
    t.nonNull.field('user', {
      type: 'User',
      resolve: (parent, _, context) => {
        return context.prisma.profile
          .findUnique({
            where: { id: parent.id },
          })
          .user();
      },
    });

    t.string('fullName', {
      description: 'The first and last name of a user',
      resolve({ firstName, lastName }) {
        return [firstName, lastName].filter((n) => Boolean(n)).join(' ');
      },
    });
  },
});

export const ProfileOrderByInput = inputObjectType({
  name: 'ProfileOrderByInput',
  description: 'Order Profile by a specific field',
  definition(t) {
    t.field('firstName', { type: 'SortOrder' });
    t.field('lastName', { type: 'SortOrder' });
  },
});

export const ProfileWhereUniqueInput = inputObjectType({
  name: 'ProfileWhereUniqueInput',
  description: 'Input to find Profiles based on unique fields',
  definition(t) {
    t.id('id');
  },
});

export const ProfileWhereInput = inputObjectType({
  name: 'ProfileWhereInput',
  description: 'Input to find Profiles based on other fields',
  definition(t) {
    t.field('firstName', { type: 'StringFilter' });
    t.field('lastName', { type: 'StringFilter' });
  },
});

export const ProfileCreateInput = inputObjectType({
  name: 'ProfileCreateInput',
  description: 'Input to create a Profile',
  definition(t) {
    t.nonNull.string('firstName');
    t.nonNull.string('lastName');
  },
});

export const ProfileUpdateInput = inputObjectType({
  name: 'ProfileUpdateInput',
  description: 'Input to update a Profile',
  definition(t) {
    t.string('firstName');
    t.string('lastName');
  },
});

export const ProfileRelationInput = inputObjectType({
  name: 'ProfileRelationInput',
  description: 'Prisma relational input',
  definition(t) {
    t.field('create', { type: 'ProfileCreateInput' });
    t.field('update', { type: 'ProfileUpdateInput' });
  },
});

```

</details>

<details>
<summary>
  Full User Module Example
</summary>

```typescript
import { objectType, queryField, mutationField, inputObjectType, arg, nonNull, enumType, list } from 'nexus';
import { Role } from '@prisma/client';
import { UserInputError } from 'apollo-server-micro';

import { appJwtForUser, comparePasswords, hashPassword } from '../../services/auth';
import { isAdmin } from '../../services/permissions';

// User Type
export const User = objectType({
  name: 'User',
  description: 'A User',
  definition(t) {
    t.nonNull.id('id');
    t.nonNull.date('createdAt');
    t.nonNull.date('updatedAt');
    t.nonNull.string('email');

    t.nonNull.list.nonNull.field('skills', {
      type: 'Skill',
      resolve: async (parent, _, context) => {
        return context.prisma.user
          .findUnique({
            where: { id: parent.id },
          })
          .skills();
      },
    });

    t.field('profile', {
      type: 'Profile',
      resolve: (parent, _, context) => {
        return context.prisma.user
          .findUnique({
            where: { id: parent.id },
          })
          .profile();
      },
    });

    t.list.field('posts', {
      type: 'Post',
      resolve: async (parent, _, context) => {
        return context.prisma.user
          .findUnique({
            where: { id: parent.id },
          })
          .posts();
      },
    });
  },
});

// Auth Payload Type
export const AuthPayload = objectType({
  name: 'AuthPayload',
  description: 'Payload returned if login is successful',
  definition(t) {
    t.field('user', { type: 'User', description: 'The logged in user' });
    t.string('token', {
      description: 'The current JWT token. Use in Authentication header',
    });
  },
});

export const MeQuery = queryField('me', {
  type: 'User',
  description: 'Returns the currently logged in user',
  resolve: (_root, _args, ctx) => ctx.user,
});

export const UsersQuery = queryField('users', {
  type: list('User'),
  args: {
    where: arg({ type: 'UserWhereInput' }),
    orderBy: arg({ type: 'UserOrderByInput', list: true }),
  },
  authorize: async (_root, _args, ctx) => !!ctx.user,
  resolve: async (_root, args, ctx) => {
    const { where = {}, orderBy = [] } = args;
    // If user is not an admin, update where.active to equal true
    let updatedQuery = where;

    if (!isAdmin(ctx.user)) {
      updatedQuery = { ...where, active: true };
    }

    return await ctx.db.user.findMany({ where: updatedQuery, orderBy });
  },
});

export const UserQuery = queryField('user', {
  type: 'User',
  authorize: async (_root, _args, ctx) => !!ctx.user,
  args: {
    where: nonNull(arg({ type: 'UserWhereUniqueInput' })),
  },
  resolve: async (_root, args, ctx) => {
    const { where } = args;
    return await ctx.db.user.findUnique({ where });
  },
});

// Mutations

export const LoginMutation = mutationField('login', {
  type: 'AuthPayload',
  description: 'Login to an existing account',
  args: { data: nonNull(arg({ type: 'LoginInput' })) },
  resolve: async (_root, args, ctx) => {
    const {
      data: { email, password },
    } = args;

    const user = await ctx.db.user.findUnique({ where: { email } });

    if (!user) {
      throw new UserInputError(`No user found for email: ${email}`, {
        invalidArgs: { email: 'is invalid' },
      });
    }

    const valid = password && user.password && comparePasswords(password, user.password);

    if (!valid) {
      throw new UserInputError('Invalid password', {
        invalidArgs: { password: 'is invalid' },
      });
    }

    const token = appJwtForUser(user);

    return {
      token,
      user,
    };
  },
});

export const CreateUserMutation = mustationField('createUser', {
  type: 'User',
  description: 'Create User for an account',
  args: {
    data: nonNull(arg({ type: 'UserCreateInput' })),
  },
  authorize: (_root, _args, ctx) => isAdmin(ctx.user),
  resolve: async (_root, args, ctx) => {
    const { data } = args;
    const existingUser = await ctx.db.user.findUnique({ where: { email: data.email } });

    if (existingUser) {
      throw new UserInputError('Email already exists.', {
        invalidArgs: { email: 'already exists' },
      });
    }

    // force role to user and hash the password
    const updatedArgs = {
      data: {
        ...data,
        password: hashPassword(data.password),
      },
    };

    const user = await ctx.db.user.create(updatedArgs);

    return user;
  },
});

export const UpdateUserMutation = mutationField('updateUser', {
  type: 'User',
  description: 'Updates a User',
  authorize: (_root, _args, ctx) => isAdmin(ctx.user),
  args: {
    where: nonNull(arg({ type: 'UserWhereUniqueInput' })),
    data: nonNull(arg({ type: 'UpdateUserInput' })),
  },
  resolve: async (_root, args, ctx) => {
    const { where, data } = args;
    return await ctx.db.user.update({ where, data });
  },
});

// Manually added types that were previously in the prisma plugin
export const UserRole = enumType({
  name: 'Role',
  members: Object.values(Role),
});

export const UserRoleFilterInput = inputObjectType({
  name: 'UserRoleFilterInput',
  description: 'Matches Prisma Relation Filter for Enum Role',
  definition(t) {
    t.field('equals', { type: 'Role', list: true });
    t.field('has', { type: 'Role' });
    t.field('hasSome', { type: 'Role', list: true });
    t.field('hasEvery', { type: 'Role', list: true });
    t.field('isEmpty', { type: 'Boolean' });
  },
});

export const UserOrderByInput = inputObjectType({
  name: 'UserOrderByInput',
  description: 'Order users by a specific field',
  definition(t) {
    t.field('active', { type: 'SortOrder' });
    t.field('createdAt', { type: 'SortOrder' });
    t.field('email', { type: 'SortOrder' });
    t.field('roles', { type: 'SortOrder' });
    t.field('updatedAt', { type: 'SortOrder' });
    // NOTE: Relational sorts not yet supported by prisma - IN PREVIEW
    // https://www.prisma.io/docs/concepts/components/prisma-client/filtering-and-sorting#sort-by-relation-preview
  },
});

export const UserWhereUniqueInput = inputObjectType({
  name: 'UserWhereUniqueInput',
  description: 'Input to find users based on unique fields',
  definition(t) {
    t.id('id');
    t.string('email');
    t.field('profile', { type: 'ProfileWhereUniqueInput' });
  },
});

export const UserWhereInput = inputObjectType({
  name: 'UserWhereInput',
  description: 'Input to find users based other fields',
  definition(t) {
    t.field('email', { type: 'StringFilter' });
    t.boolean('active');
    t.field('skills', { type: 'SkillRelationFilterInput' });
    t.field('roles', { type: 'UserRoleFilterInput' });
    t.field('profile', { type: 'ProfileWhereInput' });
  },
});

export const UserCreateInput = inputObjectType({
  name: 'UserCreateInput',
  description: 'Input to Add a new user',
  definition(t) {
    t.nonNull.string('email');
    t.nonNull.string('password');
    t.nonNull.list.nonNull.field('roles', { type: 'Role' });
    t.boolean('active');
    t.field('skills', { type: 'SkillRelationInput' });
    t.nonNull.field('profile', { type: 'ProfileRelationInput' });
  },
});

export const UpdateUserInput = inputObjectType({
  name: 'UpdateUserInput',
  description: 'Input used to update a user',
  definition: (t) => {
    t.boolean('active');
    t.field('skills', { type: 'SkillRelationInput' });
    t.field('profile', { type: 'ProfileRelationInput' });
  },
});

export const LoginInput = inputObjectType({
  name: 'LoginInput',
  description: 'Input required to login a user',
  definition: (t) => {
    t.nonNull.string('email');
    t.nonNull.string('password');
  },
});
```

</details>

<details>
<summary>
  Full Skill Module Example
</summary>

```typescript
import { objectType, queryField, mutationField, inputObjectType, list, arg, nonNull } from 'nexus';

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
    t.string('description');
    t.nonNull.boolean('archived');

    t.field('users', {
      type: list('User'),
      resolve: async (parent, _, context) => {
        return context.prisma.skill.findUnique({ where: { id: parent.id } }).users();
      },
    });
  },
});

export const SkillsQuery = queryField('skills', {
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
  },
});

export const SkillQuery = queryField('skill', {
  type: 'Skill',
  description: 'Returns a specific Skill',
  authorize: (_root, _args, ctx) => !!ctx.user,
  args: {
    where: nonNull(arg({ type: 'SkillWhereUniqueInput' })),
  },
  resolve: (_root, args, ctx) => {
    const { where } = args;
    return ctx.prisma.skill.findUnique({ where });
  },
});

export const CreateSkillMutation = mutationField('createSkill', {
  type: 'Skill',
  description: 'Creates a Skill',
  authorize: (_root, _args, ctx) => isAdmin(ctx.user),
  args: {
    data: nonNull(arg({ type: 'SkillCreateInput' })),
  },
  resolve: async (_root, args, ctx) => {
    const { data } = args;
    const existingSkill = await ctx.db.skill.findUnique({ where: { name: data.name } });

    if (existingSkill) {
      throw new Error('Skill already exists.');
    }

    return await ctx.db.skill.create(args);
  },
});

export const UpdateSkillMutation = mutationField('updateSkill', {
  type: 'Skill',
  description: 'Updates a Skill',
  authorize: (_root, _args, ctx) => isAdmin(ctx.user),
  args: {
    where: nonNull(arg({ type: 'SkillWhereUniqueInput' })),
    data: nonNull(arg({ type: 'UpdateSkillInput' })),
  },
  resolve: async (_root, args, ctx) => {
    const { where, data } = args;
    return await ctx.db.skill.update({ where, data });
  },
});

// MUTATION INPUTS
export const SkillCreateInput = inputObjectType({
  name: 'SkillCreateInput',
  description: 'Input used to create a skill',
  definition: (t) => {
    t.nonNull.string('name');
    t.string('description');
    t.string('id');
    t.boolean('archived');
  },
});

export const UpdateSkillInput = inputObjectType({
  name: 'UpdateSkillInput',
  description: 'Input used to update a skill',
  definition: (t) => {
    t.string('name');
    t.boolean('archived');
    t.string('description');
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
    t.string('name');
  },
});

export const SkillWhereInput = inputObjectType({
  name: 'SkillWhereInput',
  description: 'Input to find skills based on other fields',
  definition(t) {
    t.field('name', { type: 'StringFilter' });
    t.boolean('archived');
  },
});

export const SkillRelationFilterInput = inputObjectType({
  name: 'SkillRelationFilterInput',
  description: 'Input matching prisma relational filters for Skill',
  definition(t) {
    // NOTE: 'every' returns users with empty list - Unexpected
    // t.field('every', { type: 'SkillWhereInput' });
    t.field('none', { type: 'SkillWhereInput' });
    t.field('some', { type: 'SkillWhereInput' });
  },
});

export const SkillRelationInput = inputObjectType({
  name: 'SkillRelationInput',
  description: 'Input matching prisma relational connect for Skill',
  definition(t) {
    t.list.field('connect', { type: 'SkillWhereUniqueInput' });
    //note: for now, using set instead of disconnect but could leverage later
    // t.list.field('disconnect', { type: 'SkillWhereUniqueInput' });
    t.list.field('set', { type: 'SkillWhereUniqueInput' });
  },
});
```

</details>

<details>
<summary> Full Post Module Example </summary>

```typescript
import { inputObjectType, objectType } from 'nexus';

// Post Type
export const Post = objectType({
  name: 'Post',
  description: 'A Post',
  definition(t) {
    t.nonNull.id('id');
    t.nonNull.date('createdAt');
    t.nonNull.date('updatedAt');
    t.nonNull.string('title');
    t.string('body');
    t.nonNull.field('user', {
      type: 'User',
      resolve: (parent, _, context) => {
        return context.prisma.user
          .findUnique({
            where: { id: parent.user_id },
          })
      },
    });
  },
});

export const PostOrderByInput = inputObjectType({
  name: 'PostOrderByInput',
  description: 'Order Post by a specific field',
  definition(t) {
    t.field('title', { type: 'SortOrder' });
  },
});

export const PostWhereUniqueInput = inputObjectType({
  name: 'PostWhereUniqueInput',
  description: 'Input to find Posts based on unique fields',
  definition(t) {
    t.id('id');
  },
});

export const PostRelationInput = inputObjectType({
  name: 'PostRelationInput',
  description: 'Prisma relational input',
  definition(t) {
    t.list.field('create', { type: 'PostCreateInput' });
    t.list.field('update', { type: 'PostUpdateInput' });
  },
});

export const PostCreateInput = inputObjectType({
  name: 'PostCreateInput',
  description: 'Input to create a Post',
  definition(t) {
    t.nonNull.string('title');
    ...
  },
});
```

</details>

## Module Definitions and Joins

Rather than build the select, includes, etc. within our graphql query. When asking for a related field we have chosen to add a custom resolver on the parent. You'll see `User` has a field for `profile`, `skills`, and `posts` and is resolved with parent context. For this model, we've also chosen to make some of these nonNullable, stating that a `User` should have at least one `Skill` for example.

```typescript
export const User = objectType({
  name: 'User',
  description: 'A User',
  definition(t) {
    t.nonNull.id('id');
    t.nonNull.date('createdAt');
    t.nonNull.date('updatedAt');
    t.nonNull.string('email');

    t.nonNull.list.nonNull.field('skills', {
      type: 'Skill',
      resolve: async (parent, _, context) => {
        return context.prisma.user
          .findUnique({
            where: { id: parent.id },
          })
          .skills();
      },
    });

    t.field('profile', {
      type: 'Profile',
      resolve: (parent, _, context) => {
        return context.prisma.user
          .findUnique({
            where: { id: parent.id },
          })
          .profile();
      },
    });

    t.list.field('posts', {
      type: 'Post',
      resolve: async (parent, _, context) => {
        return context.prisma.user
          .findUnique({
            where: { id: parent.id },
          })
          .posts();
      },
    });
  },
});
```

## Naming Conventions

Iterating through, we have landed on a few patterns in naming our types. While these are not set in stone, they are recommended to stay consistent.

### Naming InputTypes

- `<Record>WhereInput`
- `<Record>WhereUniqueInput`
- `<Record>CreateInput`
- `<Record>UpdateInput`
- `<Record>RelationInput`
- `<Record>RelationFilterInput` _(NOTE: input changes based on association)_
- `<Record>OrderByInput`

### Naming Mutation Fields

- `<Record><Action>Mutation`
Examples: `UserCreateMutation`, `UserLoginMutation`

### Naming Query Fields

- `<Record><Query>`
- `<Plural><Query>`
Examples: `UserQuery`, `UsersQuery`

## Shared Nexus Types

These are common types to match Prisma, found in:
`graphql > modules > shared.ts`

- SortOrder
- StringFilter

## One to One

### Read/Filter (1-1)

Looking at our `Users` query, our where filters are defined by `UserWhereInput`.
Within that you'll see for one-to-one relations we can simply leverage another models `WhereInput` to find like items.

```typescript
const variables = {
  where: {
    profile: {
      firstName: {
        equals: "Matt"
      }
    }
  }
}
```

```typescript
export const UsersQuery = queryField('users', {
  type: list('User'),
  args: {
    where: arg({ type: 'UserWhereInput' }),
    orderBy: arg({ type: 'UserOrderByInput', list: true }),
  },

  ...

  return await ctx.db.user.findMany({ where, orderBy });
});

export const UserWhereInput = inputObjectType({
  name: 'UserWhereInput',
  description: 'Input to find users based other fields',
  definition(t) {
    ...
    t.field('profile', { type: 'ProfileWhereInput' });
  },
});
```

```typescript
export const ProfileWhereInput = inputObjectType({
  name: 'ProfileWhereInput',
  description: 'Input to find Profiles based on other fields',
  definition(t) {
    t.field('firstName', { type: 'StringFilter' });
    t.field('lastName', { type: 'StringFilter' });
  },
});
```

### Create (1-1)

For our current `User` model, you'll notice Profile is required for user creation. To do this we match Prisma's `create` key for relationships to a new input type `ProfileRelationInput`, giving us the following.

```typescript
const variables = {
  data: {
    email: "bob@gmail.com",
    profile: {
      create: {
        firstName: "Bob",
        lastName: "Smith"
      }
    }
  }
}
```

```typescript
export const CreateUserMutation = mustationField('createUser', {
  type: 'User',
  description: 'Create User for an account',
  args: {
    data: nonNull(arg({ type: 'UserCreateInput' })),
  },
  authorize: (_root, _args, ctx) => isAdmin(ctx.user),
  resolve: async (_root, args, ctx) => {
    const { data } = args;

    ... other logic

    return await ctx.db.user.create(data);
  },
});

export const UserCreateInput = inputObjectType({
  name: 'UserCreateInput',
  description: 'Input to Add a new user',
  definition(t) {
    t.nonNull.field('profile', { type: 'ProfileRelationInput' });
  },
});
```

```typescript
export const ProfileRelationInput = inputObjectType({
  name: 'ProfileRelationInput',
  description: 'Prisma relational input',
  definition(t) {
    t.field('create', { type: 'ProfileCreateInput' });
    t.field('update', { type: 'ProfileUpdateInput' });
  },
});

export const ProfileCreateInput = inputObjectType({
  name: 'ProfileCreateInput',
  description: 'Input to create a Profile',
  definition(t) {
    t.nonNull.string('firstName');
    t.nonNull.string('lastName');
  },
});
```

### Update (1-1)

Our update method for 1-1 is very similar to create. We match Prisma's `update` key and create an `UpdateInput` to tag along for the ride. In this instance we have a `ProfileUpdateInput` that can handle first name, last name updates.

```typescript
const variables = {
  where: {id: user.id},
  data: {
    profile: {
      update: {
        firstName: "Jane",
        lastName: "Doe"
      }
    }
  }
}
```

```typescript
export const UpdateUserMutation = mutationField('updateUser', {
  type: 'User',
  description: 'Updates a User',
  authorize: (_root, _args, ctx) => isAdmin(ctx.user),
  args: {
    where: nonNull(arg({ type: 'UserWhereUniqueInput' })),
    data: nonNull(arg({ type: 'UpdateUserInput' })),
  },
  resolve: async (_root, args, ctx) => {
    const { where, data } = args;
    return await ctx.db.user.update({ where, data });
  },
});

export const UserWhereUniqueInput = inputObjectType({
  name: 'UserWhereUniqueInput',
  description: 'Input to find users based on unique fields',
  definition(t) {
    t.id('id');
    t.string('email');
    t.field('profile', { type: 'ProfileWhereUniqueInput' });
  },
});

export const UpdateUserInput = inputObjectType({
  name: 'UpdateUserInput',
  description: 'Input used to update a user',
  definition: (t) => {
    ...
    t.field('profile', { type: 'ProfileRelationInput' });
  },
});
```

```typescript
export const ProfileRelationInput = inputObjectType({
  name: 'ProfileRelationInput',
  description: 'Prisma relational input',
  definition(t) {
    t.field('create', { type: 'ProfileCreateInput' });
    t.field('update', { type: 'ProfileUpdateInput' });
  },
});

export const ProfileUpdateInput = inputObjectType({
  name: 'ProfileUpdateInput',
  description: 'Input to update a Profile',
  definition(t) {
    t.string('firstName');
    t.string('lastName');
  },
});
```

## One to Many

### Read/Filter (1-n)

Similar to our 1-1 filters, you'll find a `posts` argument defined in our `UserWhereInput`. Here we leverage a similar `PostsWhereInput`

```typescript
const variables = {
  where: {
    posts: {
      title: {
        contains: "Up and Running"
      }
    }
  }
}
```

```typescript
export const UsersQuery = queryField('users', {
  type: list('User'),
  args: {
    where: arg({ type: 'UserWhereInput' }),
    orderBy: arg({ type: 'UserOrderByInput', list: true }),
  },

  ...

  return await ctx.db.user.findMany({ where, orderBy });
});

export const UserWhereInput = inputObjectType({
  name: 'UserWhereInput',
  description: 'Input to find users based other fields',
  definition(t) {
    ...
    t.field('posts', { type: 'PostsWhereInput' });
  },
});
```

```typescript
export const PostsWhereInput = inputObjectType({
  name: 'PostsWhereInput',
  description: 'Input to find Posts based on other fields',
  definition(t) {
    t.field('title', { type: 'StringFilter' });
    ...
  },
});
```

### Create (1-n)

For our one to many, we can define an option to create `n` records on User Create.
This is similar to our one-to-one creation, but adds a `.list` to the `PostRelationInput` definitions.

```typescript
const variables = {
  data: {
    email: "bob@gmail.com",
    posts: {
      create: [
        {title: "Nexus Examples"}, {title: "Vercel.. A look back"}
      ]
    }
  }
}
```

```typescript
export const CreateUserMutation = mustationField('createUser', {
  type: 'User',
  description: 'Create User for an account',
  args: {
    data: nonNull(arg({ type: 'UserCreateInput' })),
  },
  authorize: (_root, _args, ctx) => isAdmin(ctx.user),
  resolve: async (_root, args, ctx) => {
    const { data } = args;

    ... other logic

    return await ctx.db.user.create(data);
  },
});

export const UserCreateInput = inputObjectType({
  name: 'UserCreateInput',
  description: 'Input to Add a new user',
  definition(t) {
    t.nonNull.field('posts', { type: 'PostRelationInput' });
  },
});
```

```typescript
export const PostRelationInput = inputObjectType({
  name: 'PostRelationInput',
  description: 'Prisma relational input',
  definition(t) {
    t.list.field('create', { type: 'PostCreateInput' });
    t.list.field('update', { type: 'PostUpdateInput' });
  },
});

export const PostCreateInput = inputObjectType({
  name: 'PostCreateInput',
  description: 'Input to create a Post',
  definition(t) {
    t.nonNull.string('title');
    ...
  },
});
```

### Update (1-n)

This update is better left by updating the individual records in question.

## Many To Many

### Read (n-n)

To filter for a User with a specific skills, we'll be looking to match Prisma's `some` and `none` helpers.
We do this by building out a `RelationalFilterInput` for `Skills` and applying to our `WhereInput` on `User`.

```typescript
  const variables = {
    data: {
      where: {
        skills: {
          some: {id: skill.id}
        }
      }
    }
  }
```

```typescript
export const SkillRelationFilterInput = inputObjectType({
  name: 'SkillRelationFilterInput',
  description: 'Input matching prisma relational filters for Skill',
  definition(t) {
    // NOTE: 'every' returns users with empty list - Unexpected
    // t.field('every', { type: 'SkillWhereInput' });
    t.field('none', { type: 'SkillWhereInput' });
    t.field('some', { type: 'SkillWhereInput' });
  },
});
```

```typescript
  export const UsersQuery = queryField('users', {
    type: list('User'),
    args: {
      where: arg({ type: 'UserWhereInput' }),
      orderBy: arg({ type: 'UserOrderByInput', list: true }),
    },
    authorize: async (_root, _args, ctx) => !!ctx.user,
    resolve: async (_root, args, ctx) => {
      const { where = {}, orderBy = [] } = args;
      return await ctx.db.user.findMany({ where, orderBy });
    },
  });

  export const UserWhereInput = inputObjectType({
  name: 'UserWhereInput',
  description: 'Input to find users based other fields',
  definition(t) {
    ...
    t.field('skills', { type: 'SkillRelationFilterInput' });
  },
});
```

### Create (n-n)

Sticking w/ our User/Skills example, when creating a User, I would also like to associate skills with said user.
For this we have two relational methods we can leverage: `connect` and `set`. `connect` will create the associations needed in the JoinTable. `set` will overwrite any previous joins with the new array given. Both of these require a `SkillWhereUniqueInput` to successfully map the records. For this example we've chosen to leverage `connect` for Create and `set` for Update to show how this all works.

In the example below, you'll see we've added a `SkillRelationInput` type that gives us the `connect` and `set` options. We've also made this required with `nonNull` on our User, to force a relation on create. This translates to a GraphQL input that maps what prisma would expect.

```javascript
  const variables = {
    data: {
      email: "bob@echobind.com",
      ...,
      skills: {
        connect: [
          {id: "asdfqwerty1234"},
          {name: "React"},
        ]
      }
    }
  }
```

Skill Input Types

```typescript
export const SkillWhereUniqueInput = inputObjectType({
  name: 'SkillWhereUniqueInput',
  description: 'Input to find skills based on unique fields',
  definition(t) {
    t.id('id');
    t.string('name');
  },
});


export const SkillRelationInput = inputObjectType({
  name: 'SkillRelationInput',
  description: 'Input matching prisma relational connect for Skill',
  definition(t) {
    t.list.field('connect', { type: 'SkillWhereUniqueInput' });
    t.list.field('set', { type: 'SkillWhereUniqueInput' });
  },
});
```

Create User Type and Mutation:

```typescript
  export const CreateUserMutation = mutationField('createUser', {
    type: 'User',
    description: 'Create User for an account',
    args: {
      data: nonNull(arg({ type: 'UserCreateInput' })),
    },
    authorize: (_root, _args, ctx) => isAdmin(ctx.user),
    resolve: async (_root, args, ctx) => {
      const { data } = args;
      const existingUser = await ctx.db.user.findUnique({ where: { email: data.email } });

      if (existingUser) {
        throw new UserInputError('Email already exists.', {
          invalidArgs: { email: 'already exists' },
        });
      }

      // force role to user and hash the password
      const updatedArgs = {
        data: {
          ...data,
          password: hashPassword(data.password),
        },
      };

      const user = await ctx.db.user.create(updatedArgs);

      return user;
    },
  });


  export const UserCreateInput = inputObjectType({
  name: 'UserCreateInput',
  description: 'Input to Add a new user',
  definition(t) {
    ...
    t.field('skills', { type: 'SkillRelationInput' });

  },
});

```

### Update (n-n)

Similar to create for our updateUser call we will leverage `set` to overwrite and update the JoinTable with a list of newly expected Skills.

```typescript
const variables = {
  where: { id: user.id},
  data: {
    skills: {
      connect: [{id: "asdfqwerty1234"}, {name: "React"}, {name: "Elixir"}]
    }
  }
}
```

```typescript
export const UpdateUserMutation = mutationField('updateUser', {
  type: 'User',
  description: 'Updates a User',
  authorize: (_root, _args, ctx) => isAdmin(ctx.user),
  args: {
    where: nonNull(arg({ type: 'UserWhereUniqueInput' })),
    data: nonNull(arg({ type: 'UpdateUserInput' })),
  },
  resolve: async (_root, args, ctx) => {
    const { where, data } = args;
    return await ctx.db.user.update({ where, data });
  },
});

export const UpdateUserInput = inputObjectType({
  name: 'UpdateUserInput',
  description: 'Input used to update a user',
  definition: (t) => {
    t.string('email');
    t.field('skills', { type: 'SkillRelationInput' });
    ...
  },
});
```
