import { graphQLRequest, graphQLRequestAsUser, resetDB, disconnect } from '../../helpers';

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
});
