import { Prisma, Role } from '@prisma/client';
import { z } from 'zod';

import { BisonError, t } from '@/server/trpc';
import { appJwtForUser, comparePasswords, hashPassword } from '@/services/auth';
import { adminProcedure, protectedProcedure } from '@/server/middleware/auth';
import { isAdmin } from '@/services/permissions';

export const defaultUserSelect = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  email: true,
  createdAt: true,
  updatedAt: true,
  roles: true,
  profile: { select: { firstName: true, lastName: true } },
});

export const userRouter = t.router({
  me: protectedProcedure.query(async function resolve({ ctx }) {
    return ctx.user;
  }),
  users: adminProcedure
    .input(z.object({ id: z.string().optional(), email: z.string().optional() }).optional())
    .query(({ ctx, input }) => ctx.db.user.findMany({ where: input, select: defaultUserSelect })),
  user: t.procedure
    .input(z.object({ id: z.string().optional(), email: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUniqueOrThrow({ where: input, select: defaultUserSelect });

      if (!isAdmin(ctx.user) && user.id !== ctx.user?.id) {
        return { ...user, email: null };
      }

      return user;
    }),
  login: t.procedure
    .input(z.object({ email: z.string(), password: z.string() }))
    .mutation(async ({ ctx, input: { email, password } }) => {
      const result = await ctx.db.user.findUnique({
        where: { email },
        select: { ...defaultUserSelect, password: true },
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
  createUser: adminProcedure
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
