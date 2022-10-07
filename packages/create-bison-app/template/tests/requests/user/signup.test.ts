import { Role } from '@prisma/client';
import Chance from 'chance';

import { trpcRequest, resetDB, disconnect } from '@/tests/helpers';
import { UserFactory } from '@/tests/factories/user';

const chance = new Chance();

beforeEach(async () => resetDB());
afterAll(async () => disconnect());

describe('User signup mutation', () => {
  describe('existing email', () => {
    it('returns a UserInput error', async () => {
      const user = await UserFactory.create({ email: 'foo@wee.net' });

      const data = {
        email: user.email,
        password: 'fake',
        profile: { firstName: chance.first(), lastName: chance.last() },
      };

      await expect(trpcRequest().user.signup(data)).rejects.toThrowErrorMatchingInlineSnapshot(
        `"Email already exists."`
      );
    });
  });

  describe('trying to pass role', () => {
    it('throws an error', async () => {
      const data = {
        email: 'hello@wee.net',
        password: 'fake',
        profile: { firstName: chance.first(), lastName: chance.last() },
        roles: [Role.ADMIN],
      };

      const {
        user: { email, roles },
      } = await trpcRequest().user.signup(data);

      expect({ email, roles }).toEqual({ email: 'hello@wee.net', roles: ['USER'] });
    });
  });

  describe('valid signup', () => {
    it('creates the user', async () => {
      const { roles: _, ...attrs } = UserFactory.build();

      const data = {
        ...attrs,
        profile: { firstName: chance.first(), lastName: chance.last() },
      };

      const response = await trpcRequest().user.signup(data);
      const { token, user } = response;

      expect(token).not.toBeNull();
      expect(user.id).not.toBeNull();
    });
  });
});
