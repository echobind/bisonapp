import { graphQLRequest, graphQLRequestAsUser, resetDB, disconnect } from '../../helpers';
import { UserFactory } from '../../factories/user';
import { Role } from '@prisma/client';

beforeEach(async () => resetDB());
afterAll(async () => disconnect());

describe('users query', () => {
  describe('not logged in', () => {
    it('returns an Unauthorized error', async () => {
      const query = `
        query USERS {
          users {
            email
          }
        }
      `;

      const response = await graphQLRequest({ query });
      const errorMessages = response.body.errors.map((e) => e.message);

      expect(errorMessages).toMatchInlineSnapshot(`
        Array [
          "Unauthorized",
        ]
      `);
    });
  });

  describe('logged in as a user', () => {
    it('returns an Unauthorized error', async () => {
      const query = `
        query USERS {
          users {
            email
          }
        }
      `;

      const user = await UserFactory.create();
      const response = await graphQLRequestAsUser(user, { query });
      const errorMessages = response.body.errors.map((e) => e.message);

      expect(errorMessages).toMatchInlineSnapshot(`
        Array [
          "Unauthorized",
        ]
      `);
    });
  });

  describe('logged in as an admin', () => {
    it('returns an Unauthorized error', async () => {
      const query = `
        query USERS {
          users {
            email
          }
        }
      `;

      // create an admin and a regular user
      const user1 = await UserFactory.create({ roles: [Role.ADMIN] });
      const user2 = await UserFactory.create();

      const response = await graphQLRequestAsUser(user1, { query });
      const { users } = response.body.data;

      const expectedUsers = [user1, user2].map((u) => u.email);
      const actualUsers = users.map((u) => u.email);

      expect(expectedUsers).toEqual(actualUsers);
    });
  });
});
