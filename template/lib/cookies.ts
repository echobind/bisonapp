import Cookies from 'universal-cookie';

/**
 * Handles cookies on both server and client
 */
export function cookies(ctx: Record<string, any> = {}) {
  const cookieFromHeader = ctx?.req?.headers?.cookie;
  return new Cookies(cookieFromHeader);
}
