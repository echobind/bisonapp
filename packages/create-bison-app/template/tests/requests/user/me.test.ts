import { trpcRequest, resetDB, disconnect } from '@/tests/helpers';
import { UserFactory } from '@/tests/factories/user';

beforeEach(async () => resetDB());
afterAll(async () => disconnect());

describe('me query', () => {
  describe('not logged in', () => {
    it('returns null ', async () => {
      await expect(trpcRequest().user.me()).rejects.toMatchInlineSnapshot(
        `[TRPCError: UNAUTHORIZED]`
      );
    });
  });

  describe('logged in', () => {
    it('returns user data', async () => {
      const user = await UserFactory.create({
        email: 'foo@wee.net',
      });

      const { email, roles } = await trpcRequest(user).user.me();

      expect({ email, roles }).toEqual({ email: 'foo@wee.net', roles: ['USER'] });
    });
  });
});
