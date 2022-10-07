import { Role } from '@prisma/client';

import { resetDB, disconnect, trpcRequest } from '@/tests/helpers';
import { UserFactory } from '@/tests/factories/user';

beforeEach(async () => resetDB());
afterAll(async () => disconnect());

describe('User createUser mutation', () => {
  describe('non-admin', () => {
    it('returns a Forbidden error', async () => {
      const user = await UserFactory.create({ email: 'foo@wee.net' });

      await expect(
        trpcRequest(user).user.createUser({
          email: user.email,
          password: 'fake',
        })
      ).rejects.toThrowErrorMatchingInlineSnapshot(`"UNAUTHORIZED"`);
    });
  });

  describe('admin', () => {
    it('allows setting role', async () => {
      const admin = await UserFactory.create({ roles: { set: [Role.ADMIN] } });

      const user = await trpcRequest(admin).user.createUser({
        email: 'hello@wee.net',
        password: 'fake',
        roles: [Role.ADMIN],
      });

      const expectedRoles = [Role.ADMIN];
      expect(user.id).not.toBeNull();
      expect(user.roles).toEqual(expectedRoles);
    });
  });
});
