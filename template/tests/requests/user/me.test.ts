import { graphQLRequest, graphQLRequestAsUser, resetDB, disconnect } from '../../helpers';
import { UserFactory } from '../../factories/user';

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
          "extensions": Object {
            "cacheControl": Object {
              "hints": Array [
                Object {
                  "maxAge": 0,
                  "path": Array [
                    "me",
                  ],
                },
              ],
              "version": 1,
            },
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
          "extensions": Object {
            "cacheControl": Object {
              "hints": Array [
                Object {
                  "maxAge": 0,
                  "path": Array [
                    "me",
                  ],
                },
              ],
              "version": 1,
            },
          },
        }
      `);
    });
  });
});
