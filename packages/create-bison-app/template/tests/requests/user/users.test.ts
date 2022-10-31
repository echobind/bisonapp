import { Role } from '@prisma/client';

import { resetDB, disconnect, trpcRequest } from '@/tests/helpers';
import { UserFactory } from '@/tests/factories/user';

beforeEach(async () => resetDB());
afterAll(async () => disconnect());

describe('users query', () => {
  describe('not logged in', () => {
    it('returns an Unauthorized error', async () => {
      await expect(trpcRequest().user.findMany()).rejects.toThrowErrorMatchingInlineSnapshot(
        `"UNAUTHORIZED"`
      );
    });
  });

  describe('logged in as a user', () => {
    it('returns an Unauthorized error', async () => {
      const user = await UserFactory.create();
      await expect(trpcRequest(user).user.findMany()).rejects.toThrowErrorMatchingInlineSnapshot(
        `"UNAUTHORIZED"`
      );
    });
  });

  describe('logged in as an admin', () => {
    it('returns the user objects', async () => {
      // create an admin and a regular user
      const user1 = await UserFactory.create({ roles: { set: [Role.ADMIN] } });
      const user2 = await UserFactory.create();

      const users = await trpcRequest(user1).user.findMany();

      const expectedUsers = [user1, user2].map((u) => u.email);
      const actualUsers = users.map((u) => u.email);

      expect(expectedUsers).toEqual(actualUsers);
    });
  });

  describe('trying to view another users email', () => {
    it('returns undefined for the email', async () => {
      // create 2 users
      const user1 = await UserFactory.create();
      const user2 = await UserFactory.create();

      const response = await trpcRequest(user1).user.find({ id: user2.id });
      const { id, email } = response;

      expect(id).not.toBeNull();
      expect(email).toBeNull();
    });
  });

  describe('admin trying to view another users email', () => {
    it('returns the email', async () => {
      // create an admin and a regular user
      const user1 = await UserFactory.create({ roles: { set: [Role.ADMIN] } });
      const user2 = await UserFactory.create();

      const response = await trpcRequest(user1).user.find({ id: user2.id });
      const { id, email } = response;

      expect(id).not.toBeNull();
      expect(email).not.toBeNull();
    });
  });
});
