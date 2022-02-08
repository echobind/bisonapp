import { Role, Profile, User } from '@prisma/client';

import { Context } from '@/graphql/context';

/**
 * Returns true if the user has a role of admin
 * @param user The user to check the role for
 */
export const isAdmin = (user: Partial<User> | null): boolean => {
  if (!user?.roles) {
    return false;
  }

  return user.roles.includes(Role.ADMIN);
};

/**
 * Returns true if the passed in user is the same as the logged in user
 * @param user the user to test
 * @param ctx the context which contains the current user
 */
export function isSelf(user: Pick<User, 'id'>, ctx: Context): boolean {
  return user.id === ctx.user?.id;
}

/**
 * Returns true if a user can access an object. This is a very basic check that quickly does the following:
 *   The current user is an admin
 *   The current user is trying to access themselves
 *   The object has a userId property that the same id as the current user
 * @param object the object to check for a userId property on
 * @param ctx the context which contains the current user
 * @param idField the key in the object to check against
 */
export function canAccess(object: Profile | User, ctx: Context, idField = 'userId'): boolean {
  if (!ctx.user) return false;
  if (isAdmin(ctx.user)) return true;
  if (isSelf(object, ctx)) return true;

  return (object as any)[idField] === ctx.user?.id;
}
