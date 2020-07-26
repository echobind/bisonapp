import { Role } from '@prisma/client';
import { graphQLRequest, graphQLRequestAsUser, resetDB, prisma, disconnect } from '../../helpers';

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

      const user = await prisma.user.create({
        data: { email: 'foo@wee.net', password: 'asdf', roles: { set: [Role.USER] } },
      });
      await disconnect();

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
