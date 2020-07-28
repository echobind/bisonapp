/**
 * Handles auth actions on the API.
 */

import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { User } from '@prisma/client';

/**
 * Hashes a password using bcrypt
 * @param password the password to hash
 */
export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 10);
}

/**
 * Compares a password against a hashed password
 * @param password The password to compare
 * @param hashedPassword The hashed password
 */
export function comparePasswords(password: string, hashedPassword: string): boolean {
  return bcrypt.compareSync(password, hashedPassword);
}

/**
 * Signs a JWT for the provided user
 * @param user The user to return a JWT for
 */
export const appJwtForUser = (user: Partial<User>): string => {
  return jwt.sign({ userId: user.id }, process.env.APP_SECRET);
};

/**
 * Parses and verifies a JWT token from header string
 * @param header The header to verify
 */
export const verifyAuthHeader = (header?: string): JWT | undefined => {
  if (!header) return;
  const token = header.replace('Bearer ', '');

  try {
    return jwt.verify(token, process.env.APP_SECRET) as JWT;
  } catch (e) {
    return;
  }
};

interface JWT {
  userId: string;
}
