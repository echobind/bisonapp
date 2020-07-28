import { Role } from '@prisma/client';

import { graphQLRequest, resetDB, disconnect } from '../../helpers';
import { UserFactory } from '../../factories/user';

beforeEach(async () => resetDB());
afterAll(async () => disconnect());

describe('User createUser mutation', () => {
  describe('existing email', () => {
    it('returns a UserInput error', async () => {
      const query = `
        mutation SIGNUP($data: UserCreateInput!) {
          createUser(data: $data) {
            id
            email
          }
        }
      `;

      const user = await UserFactory.create({ email: 'foo@wee.net' });

      const variables = { email: user.email, password: 'fake' };
      const response = await graphQLRequest({ query, variables });
      const errorMessages = response.body.errors.map((e) => e.message);

      expect(errorMessages).toMatchInlineSnapshot(`
        Array [
          "Variable \\"$data\\" of required type \\"UserCreateInput!\\" was not provided.",
        ]
      `);
    });
  });

  describe('trying to pass role', () => {
    it('forces to USER', async () => {
      const query = `
        mutation SIGNUP($data: UserCreateInput!) {
          createUser(data: $data) {
            id
            roles
          }
        }
      `;

      const variables = {
        data: { email: 'hello@wee.net', password: 'fake', roles: { set: [Role.ADMIN] } },
      };

      const response = await graphQLRequest({ query, variables });
      const user = response.body.data.createUser;

      const expectedRoles = [Role.USER];
      expect(user.roles).toEqual(expectedRoles);
    });
  });

  describe('valid signup', () => {
    it('creates the user', async () => {
      const query = `
        mutation SIGNUP($data: UserCreateInput!) {
          createUser(data: $data) {
            id
          }
        }
      `;

      const attrs = UserFactory.build();
      const variables = { data: { ...attrs } };
      const response = await graphQLRequest({ query, variables });
      const user = response.body.data.createUser;

      expect(user.id).not.toBeNull();
    });
  });
});
