import { trpcRequest, resetDB, disconnect } from '@/tests/helpers';
import { UserFactory } from '@/tests/factories/user';

beforeEach(async () => resetDB());
afterAll(async () => disconnect());

describe('login mutation', () => {
  describe('invalid email', () => {
    it('returns an Authentication error', async () => {
      await UserFactory.create({ email: 'foo@wee.net' });

      await expect(
        trpcRequest().user.login({ email: 'fake', password: 'fake' })
      ).rejects.toThrowErrorMatchingInlineSnapshot(`"No user found for email: fake"`);
    });
  });

  describe('invalid password', () => {
    it('returns an Authentication error', async () => {
      const user = await UserFactory.create({ email: 'foo@wee.net' });

      await expect(
        trpcRequest().user.login({ email: user.email, password: 'fake' })
      ).rejects.toThrowErrorMatchingInlineSnapshot(`"Invalid password"`);
    });
  });

  describe('valid password', () => {
    it('returns the auth payload', async () => {
      const password = 'asdf';

      const user = await UserFactory.create({
        email: 'test@wee.net',
        password,
      });

      const {
        token,
        user: { email, roles },
      } = await trpcRequest().user.login({ email: user.email, password });

      expect(token).toBeTruthy();
      expect(typeof token).toEqual('string');
      expect({ email, roles }).toEqual({ email: 'test@wee.net', roles: ['USER'] });
    });
  });
});
