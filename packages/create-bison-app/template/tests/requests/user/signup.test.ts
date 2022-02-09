import { Role } from '@prisma/client';
import Chance from 'chance';
import { GraphQLError } from 'graphql';

import { graphQLRequest, resetDB, disconnect } from '@/tests/helpers';
import { UserFactory } from '@/tests/factories/user';

const chance = new Chance();

beforeEach(async () => resetDB());
afterAll(async () => disconnect());

describe('User signup mutation', () => {
  describe('existing email', () => {
    it('returns a UserInput error', async () => {
      const query = `
        mutation SIGNUP($data: SignupInput!) {
          signup(data: $data) {
            token
            user {
              id
            }
          }
        }
      `;

      const user = await UserFactory.create({ email: 'foo@wee.net' });

      const variables = {
        data: {
          email: user.email,
          password: 'fake',
          profile: { create: { firstName: chance.first(), lastName: chance.last() } },
        },
      };

      const response = await graphQLRequest({ query, variables });
      const errorMessages = response.body.errors.map((e: GraphQLError) => e.message);

      expect(errorMessages).toMatchInlineSnapshot(`
        Array [
          "Email already exists.",
        ]
      `);
    });
  });

  describe('trying to pass role', () => {
    it('throws an error', async () => {
      const query = `
        mutation SIGNUP($data: SignupInput!) {
          signup(data: $data) {
            token
            user {
              id
            }
          }
        }
      `;

      const variables = {
        data: {
          email: 'hello@wee.net',
          password: 'fake',
          profile: { create: { firstName: chance.first(), lastName: chance.last() } },
          roles: { set: [Role.ADMIN] },
        },
      };

      const response = await graphQLRequest({ query, variables });
      const errors = response.body.errors.map((e: GraphQLError) => e.message);

      expect(errors).toMatchInlineSnapshot(`
        Array [
          "Variable \\"$data\\" got invalid value { email: \\"hello@wee.net\\", password: \\"fake\\", profile: { create: [Object] }, roles: { set: [Array] } }; Field \\"roles\\" is not defined by type \\"SignupInput\\".",
        ]
      `);
    });
  });

  describe('valid signup', () => {
    it('creates the user', async () => {
      const query = `
        mutation SIGNUP($data: SignupInput!) {
          signup(data: $data) {
            token
            user {
              id
            }
          }
        }
      `;

      // eslint-disable-next-line
      const { roles, ...attrs } = UserFactory.build();

      const variables = {
        data: {
          ...attrs,
          profile: { create: { firstName: chance.first(), lastName: chance.last() } },
        },
      };

      const response = await graphQLRequest({ query, variables });
      const { token, user } = response.body.data.signup;

      expect(token).not.toBeNull();
      expect(user.id).not.toBeNull();
    });
  });
});
