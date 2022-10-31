# tRPC Examples

## Disclaimer

This is not perfect and still a work in progress as we refine and iterate throughout our own applications. As tRPC and Prisma evolve so will these examples. :slight_smile:

Found a better pattern? Let us know and open a PR!

The goal here is to provide working examples of EB naming best practices, and relational tRPC inputs that pair with Prisma.

- [tRPC Examples](#trpc-examples)
  - [Disclaimer](#disclaimer)
  - [Context](#context)
  - [Router References](#router-references)
  - [Module Definitions and Joins](#module-definitions-and-joins)
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

## Router References

<details>
<summary>
  Full User Module Example
</summary>

```typescript
import { Prisma } from '@prisma/client';
import { z } from 'zod';

import { t } from '@/server/trpc';
import { adminProcedure, protectedProcedure } from '@/server/middleware/auth';

import { isAdmin } from '../../services/permissions';
import { appJwtForUser, comparePasswords, hashPassword } from '../../services/auth';

export const defaultUserSelect = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  email: true,
});

export const userRouter = t.router({
  me: protectedProcedure.query(async ({ ctx }) => ctx.user),
  findMany: protectedProcedure
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

      // If user is not an admin, update where.active to equal true
      let updatedQuery = where;

      if (!isAdmin(ctx.user)) {
        updatedQuery = { ...where, active: true };
      }

      return await ctx.db.user.findMany({
        where: updatedQuery,
        orderBy,
        select: defaultUserSelect,
        include: { profile: true },
      });
    }),
  find: protectedProcedure.input({ where: z.object({ id: z.string().optional(), email: z.string().optional() }) }).query(async ({ ctx, input }) => {
    const { where } = input;

    return await ctx.db.user.findUnique({
      where,
      select: defaultUserSelect,
      include: { profile: true },
    });
  }),
  login: t.procedure.input(z.object({ email: z.string(), password: z.string() })).mutation(async ({ ctx, input: { email, password } }) => {
    const result = await ctx.db.user.findUnique({
      where: { email },
      select: { ...defaultUserSelect, password: true },
      include: { profile: true },
    });

    if (!result) {
      throw new BisonError({
        message: `No user found for email: ${email}`,
        code: 'BAD_REQUEST',
        invalidArgs: { email: `No user found for email: ${email}` },
      });
    }

    const { password: userPassword, ...user } = result;

    const valid = comparePasswords(password, userPassword);

    if (!valid) {
      throw new BisonError({
        message: 'Invalid password',
        code: 'BAD_REQUEST',
        invalidArgs: { password: 'Invalid password' },
      });
    }

    const token = appJwtForUser(user);

    return {
      token,
      user,
    };
  }),
  signup: t.procedure
    .input(
      z.object({
        email: z.string(),
        password: z.string(),
        profile: z.object({ firstName: z.string(), lastName: z.string() }),
      })
    )
    .mutation(async ({ ctx, input: { email, password, profile } }) => {
      const existingUser = await ctx.db.user.findUnique({
        where: { email },
        select: defaultUserSelect,
      });

      if (existingUser) {
        throw new BisonError({
          message: 'Email already exists.',
          code: 'BAD_REQUEST',
          invalidArgs: { email: 'Email already exists.' },
        });
      }

      // force role to user and hash the password
      const user = await ctx.db.user.create({
        data: {
          email,
          profile: { create: profile },
          roles: { set: [Role.USER] },
          password: hashPassword(password),
        },
        select: defaultUserSelect,
      });

      const token = appJwtForUser(user);

      return {
        user,
        token,
      };
    }),
  create: adminProcedure
    .input(
      z.object({
        email: z.string(),
        password: z.string(),
        roles: z.array(z.nativeEnum(Role)).optional(),
        profile: z.object({ firstName: z.string(), lastName: z.string() }).optional(),
      })
    )
    .mutation(async ({ ctx, input: { email, password, roles = [Role.USER], profile } }) => {
      const existingUser = await ctx.db.user.findUnique({ where: { email } });

      if (existingUser) {
        throw new BisonError({
          message: 'Email already exists.',
          code: 'BAD_REQUEST',
          invalidArgs: { email: 'Email already exists.' },
        });
      }

      // force role to user and hash the password
      const updatedArgs = {
        data: {
          email,
          roles,
          profile,
          password: hashPassword(password),
        },
        select: defaultUserSelect,
      };

      const user = await ctx.db.user.create(updatedArgs);

      return user;
    }),
});
```

</details>

<details>
<summary>
  Full Skill Module Example
</summary>

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
  description: true,
  archived: true,
});

export const skillRouter = t.router({
  findMany: protectedProcedure
    .input(
      z.object({
        where: z.object({ name: z.string().optional(), archived: z.boolean().optional() }).optional(),
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
  find: protectedProcedure.input(z.object({ where: z.object({ id: z.string().optional(), name: z.string.optional() }) })).query(async ({ ctx, input }) => {
    const { where } = input;
    return ctx.prisma.skill.findUnique({ where, select: defaultSkillSelect });
  }),
  create: adminProcedure.input(z.object({ data: z.object({ name: z.string() }) })).mutation(async ({ ctx, input }) => {
    const { data } = input;
    return await ctx.db.skill.create({ data, select: defaultSkillSelect });
  }),
  update: adminProcedure
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

## Module Definitions and Joins

Unlike GraphQL, by default the client can't specify which fields it wants. While slightly less inconvenient for the client, this makes writing robust server code easier. Instead of building DataLoaders and dealing with the N+1 problem, you can create a new, separate procedure for any data that needs to employ any joins. Within that procedure, you can craft your database queries to limit the amount of traffic and provide the best speed.

```typescript
export const userRouter = t.router({
  // ...
  getWithPosts: protectedProcedure
    .input({
      where: z.object({ id: z.string().optional(), email: z.string().optional() }),
    })
    .query(async ({ ctx, input }) => {
      const { where } = input;

      return await ctx.db.user.findUnique({
        where,
        select: defaultUserSelect,
        include: { profile: true, posts: true },
      });
    }),
});
```

Alternatively, you could include options in your procedure input for choosing specifically what fields or joins to make, giving the client a little more flexibility.

## One to One

### Read/Filter (1-1)

Looking at our `users` procedure, our where filters are defined using an input that includes `where`.
Within that you'll see for one-to-one relations we can leverage `stringFilter` to find like items.

```typescript
const input = {
  where: {
    profile: {
      firstName: {
        equals: 'Matt',
      },
    },
  },
};
```

```typescript
const stringFilter = z.object({
  contains:z.string().optional(),
  endsWith:z.string().optional(),
  equals:z.string().optional(),
  gt:z.string().optional(),
  gte:z.string().optional(),
  in:z.string().array().optional(),
  lt:z.string().optional(),
  lte:z.string().optional(),
  notIn:z.string().array().optional(),
  startsWith:z.string().optional(),
})

const filterProfileFields = z.object({
  firstName: stringFilter
  lastName: stringFilter
});

export const userRouter = t.router({
  findMany: protectedProcedure
    .input(
      z.object({
        where: z.object({
          profile: profileFields
        }).optional(),
        orderBy: z
          .object({ name: z.enum(['asc', 'desc']) })
          .array()
          .optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { where = {}, orderBy = [] } = input;

      return await ctx.db.user.findMany({
        where: updatedQuery,
        orderBy,
        select: defaultUserSelect,
        include: { profile: true },
      });
    }),
    // ...
})
```

### Create (1-1)

For our current `User` model, you'll notice Profile is required for user creation. To do this we match Prisma's `create` key for relationships to the `profileFields` definition, giving us the following.

```typescript
const input = {
  data: {
    email: 'bob@gmail.com',
    profile: {
      create: {
        firstName: 'Bob',
        lastName: 'Smith',
      },
    },
  },
};
```

```typescript
const profileFields = z.object({
  firstName: z.string(),
  lastName: z.string()
});

export const userRouter = t.router({
  create: adminProcedure
    .input(
      z.object({
        data: z.object({
          email: z.string();
          profile: z.object({
            create: profileFields
          })
        })
      })
    )
    .mutation(async ({ ctx, input }) => {
      const {data} = input
      // other logic

      const user = await ctx.db.user.create({data});

      return user;
    }),
});
```

### Update (1-1)

Our update method for 1-1 is very similar to create. We match Prisma's `update` key with our Zod validator. In this instance we use a `optionalProfileFields` validator that can handle first name, last name updates.

```typescript
const variables = {
  where: { id: user.id },
  data: {
    profile: {
      update: {
        firstName: 'Jane',
        lastName: 'Doe',
      },
    },
  },
};
```

```typescript
const optionalProfileFields = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

export const userRouter = t.router({
  create: adminProcedure
    .input(
      z.object({
        where: z.object({
          id: z.string().optional(),
          email: z.string().optional(),
        }),
        data: z.object({
          email: z.string().optional(),
          profile: z
            .object({
              update: optionalProfileFields,
            })
            .optional(),
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { data, where } = input;
      // other logic

      return await ctx.db.user.update({ where, data });
    }),
});
```

## One to Many

### Read/Filter (1-n)

Similar to our 1-1 filters, you'll find a `posts` argument defined in our input. Here we leverage a similar `postFields` validator.

```typescript
const variables = {
  where: {
    posts: {
      title: {
        contains: 'Up and Running',
      },
    },
  },
};
```

```typescript
export const userRouter = t.router({
  users: protectedProcedure
    .input(
      z.object({
        where: z
          .object({
            name: z.string().optional(),
            posts: z
              .object({
                title: stringFilter.optional(),
              })
              .optional(),
          })
          .optional(),
        orderBy: z
          .object({ name: z.enum(['asc', 'desc']) })
          .array()
          .optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { where = {}, orderBy = [] } = input;

      return await ctx.db.user.findMany({
        where,
        orderBy,
        select: defaultUserSelect,
        include: { posts: true },
      });
    }),
});
```

### Create (1-n)

For our one to many, we can define an option to create `n` records on User Create.
This is similar to our one-to-one creation, but adds a `.array` to the post input definitions.

```typescript
const variables = {
  data: {
    email: 'bob@gmail.com',
    posts: {
      create: [{ title: 'tRPC Examples' }, { title: 'Vercel.. A look back' }],
    },
  },
};
```

```typescript
export const userRouter = t.router({
  create: adminProcedure
    .input(
      z.object({
        data: z.object({
          email: z.string(),
          posts: z
            .object({
              create: z
                .object({
                  title: z.string(),
                })
                .array()
                .optional(),
            })
            .optional(),
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.create(input);

      return user;
    }),
});
```

### Update (1-n)

This kind of update is better left to updating the individual records in question.

## Many To Many

### Read (n-n)

To filter for a User with a specific skills, we'll be looking to match Prisma's `some` and `none` helpers.

```typescript
const variables = {
  data: {
    where: {
      skills: {
        some: { id: skill.id },
      },
    },
  },
};
```

```typescript
export const userRouter = t.router({
  findMany: protectedProcedure
    .input(
      z.object({
        where: z
          .object({
            skills: z
              .object({
                some: z
                  .object({
                    id: z.string(),
                  })
                  .optional(),
                none: z
                  .object({
                    id: z.string(),
                  })
                  .optional(),
              })
              .optional(),
          })
          .optional(),
        orderBy: z
          .object({ name: z.enum(['asc', 'desc']) })
          .array()
          .optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { where = {}, orderBy = [] } = input;

      return await ctx.db.user.findMany({
        where,
        orderBy,
        select: defaultUserSelect,
        include: { posts: true },
      });
    }),
});
```

### Create (n-n)

Sticking w/ our User/Skills example, when creating a User, I would also like to associate skills with said user.
For this we have two relational methods we can leverage: `connect` and `set`. `connect` will create the associations needed in the JoinTable. `set` will overwrite any previous joins with the new array given. Both of these require an input to successfully map the records. For this example we've chosen to leverage `connect` for Create and `set` for Update to show how this all works.

In the example below, our validator gives us the `connect` and `set` options. We've also made this required by omitting `optional` on our User, to force a relation on create.

```javascript
  const input = {
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

```typescript
export const userRouter = t.router({
  create: adminProcedure
    .input(
      z.object({
        data: z.object({
          email: z.string(),
          skills: z
            .object({
              connect: z
                .object({
                  id: z.string().optional(),
                  title: z.string().optional(),
                })
                .array(),
            })
            .optional(),
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.create(input);

      return user;
    }),
});
```

### Update (n-n)

Similar to create for our `update` call we will leverage `set` to overwrite and update the JoinTable with a list of newly expected Skills.

```typescript
const variables = {
  where: { id: user.id },
  data: {
    skills: {
      connect: [{ id: 'asdfqwerty1234' }, { name: 'React' }, { name: 'Elixir' }],
    },
  },
};
```

```typescript
export const userRouter = t.router({
  create: adminProcedure
    .input(
      z.object({
        where: z.object({
          id: z.string(),
        }),
        data: z.object({
          skills: z
            .object({
              connect: z
                .object({
                  id: z.string().optional(),
                  title: z.string().optional(),
                })
                .array(),
            })
            .optional(),
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.create(input);

      return user;
    }),
});
```
