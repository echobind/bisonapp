import { Role } from '@prisma/client';
import { GraphQLError } from 'graphql';

import { graphQLRequest, graphQLRequestAsUser, resetDB, disconnect } from '@/tests/helpers';
import { UserFactory } from '@/tests/factories/user';
import { User, UserWhereUniqueInput } from '@/types';

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
      const errorMessages = response.body.errors.map((e: GraphQLError) => e.message);

      expect(errorMessages).toMatchInlineSnapshot(`
        Array [
          "Not authorized",
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
      const errorMessages = response.body.errors.map((e: GraphQLError) => e.message);

      expect(errorMessages).toMatchInlineSnapshot(`
        Array [
          "Not authorized",
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
      const user1 = await UserFactory.create({ roles: { set: [Role.ADMIN] } });
      const user2 = await UserFactory.create();

      const response = await graphQLRequestAsUser(user1, { query });
      const { users }: { users: Pick<User, 'email'>[] } = response.body.data;

      const expectedUsers = [user1, user2].map((u) => u.email);
      const actualUsers = users.map((u) => u.email);

      expect(expectedUsers).toEqual(actualUsers);
    });
  });

  describe('trying to view another users email', () => {
    it('returns undefined for the email', async () => {
      const query = `
        query USER($id: ID!) {
          user( where: {id: $id} ) {
            id
            email
          }
        }
      `;

      // create 2 users
      const user1 = await UserFactory.create();
      const user2 = await UserFactory.create();
      const variables: UserWhereUniqueInput = { id: user2.id };

      const response = await graphQLRequestAsUser(user1, { query, variables });
      const { id, email } = response.body.data.user;

      expect(id).not.toBeNull();
      expect(email).toBeNull();
    });
  });

  describe('admin trying to view another users email', () => {
    it('returns the email', async () => {
      const query = `
        query USER($id: ID!) {
          user(where: { id: $id }) {
            id
            email
          }
        }
      `;

      // create an admin and a regular user
      const user1 = await UserFactory.create({ roles: { set: [Role.ADMIN] } });
      const user2 = await UserFactory.create();
      const variables: UserWhereUniqueInput = { id: user2.id };

      const response = await graphQLRequestAsUser(user1, { query, variables });
      const { id, email } = response.body.data.user;

      expect(id).not.toBeNull();
      expect(email).not.toBeNull();
    });
  });
});
