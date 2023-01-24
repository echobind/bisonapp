import { Prisma, Role } from '@prisma/client';
import { z } from 'zod';

import { BisonError, t } from '@/server/trpc';
import { hashPassword } from '@/services/auth';
import { adminProcedure, protectedProcedure } from '@/server/middleware/auth';
import { isAdmin } from '@/services/permissions';

export const defaultUserSelect = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  email: true,
  createdAt: true,
  updatedAt: true,
  roles: true,
  profile: { select: { firstName: true, lastName: true, image: true } },
});

export const userRouter = t.router({
  me: protectedProcedure
    .input(z.object({})) // required for openAPI
    .meta({ openapi: { method: 'GET', path: '/me', private: true } })
    .output(z.promise(z.any()))
    .query(async function resolve({ ctx }) {
      return ctx.user;
    }),
  findMany: adminProcedure
    .input(z.object({ id: z.string().optional(), email: z.string().optional() }).optional())
    .meta({ openapi: { method: 'GET', path: '/users', private: true } })
    .output(z.promise(z.any()))
    .query(({ ctx, input }) => ctx.db.user.findMany({ where: input, select: defaultUserSelect })),
  find: t.procedure
    .input(z.object({ id: z.string().optional(), email: z.string().optional() }))
    .meta({ openapi: { method: 'GET', path: '/user', private: true } })
    .output(z.promise(z.any()))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUniqueOrThrow({
        where: input,
        select: defaultUserSelect,
      });

      if (!isAdmin(ctx.user) && user.id !== ctx.user?.id) {
        return { ...user, email: null };
      }

      return user;
    }),
  create: adminProcedure
    .input(
      z.object({
        email: z.string(),
        password: z.string(),
        roles: z.array(z.nativeEnum(Role)).optional(),
        profile: z.object({ firstName: z.string(), lastName: z.string() }),
      })
    )
    .meta({ openapi: { method: 'POST', path: '/user/create', private: true } })
    .output(z.promise(z.any()))
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
          profile: { create: profile },
          password: hashPassword(password),
        },
        select: defaultUserSelect,
      };

      return await ctx.db.user.create(updatedArgs);
    }),
});
