import { graphQLRequest, graphQLRequestAsUser, resetDB, disconnect } from '@/tests/helpers';
import { UserFactory } from '@/tests/factories/user';

beforeEach(async () => resetDB());
afterAll(async () => disconnect());

describe('me query', () => {
  describe('not logged in', () => {
    it('returns null ', async () => {
      const query = `
        query ME {
          me {
            id
          }
        }
      `;

      const response = await graphQLRequest({ query });

      expect(response.body).toMatchInlineSnapshot(`
        Object {
          "data": Object {
            "me": null,
          },
        }
      `);
    });
  });

  describe('logged in', () => {
    it('returns user data', async () => {
      const query = `
        query ME {
          me {
            email
            roles
          }
        }
      `;

      const user = await UserFactory.create({
        email: 'foo@wee.net',
      });

      const response = await graphQLRequestAsUser(user, { query });

      expect(response.body).toMatchInlineSnapshot(`
        Object {
          "data": Object {
            "me": Object {
              "email": "foo@wee.net",
              "roles": Array [
                "USER",
              ],
            },
          },
        }
      `);
    });
  });
});
