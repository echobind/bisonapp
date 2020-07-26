/**
 * Handles auth actions on the API.
 */

import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { Role, User } from '@prisma/client';

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
 * Returns true if the user has a role of admin
 * @param user The user to check the role for
 */
export const isAdmin = (user: Partial<User>): boolean => {
  return user.role === Role.ADMIN;
};
