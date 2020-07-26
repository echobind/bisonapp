import { graphQLRequest, resetDB, prisma, disconnect } from '../../helpers';
import { Role } from '@prisma/client';
import { hashPassword } from '../../../services/auth';

beforeEach(async () => resetDB());
afterAll(async () => disconnect());

describe('login mutation', () => {
  const query = `
    mutation LOGIN($email: String!, $password: String!) {
      login(email: $email, password: $password) {
        user {
          email
        }
      }
    }
  `;

  describe('invalid email', () => {
    it('returns an Authentication error', async () => {
      await prisma.user.create({
        data: { email: 'foo@wee.net', password: 'asdf', roles: { set: [Role.USER] } },
      });

      const variables = { email: 'fake', password: 'fake' };
      const response = await graphQLRequest({ query, variables });
      const errorMessages = response.body.errors.map((e) => e.message);

      expect(errorMessages).toMatchInlineSnapshot(`
        Array [
          "No user found for email: fake",
        ]
      `);
    });
  });

  describe('invalid password', () => {
    it('returns an Authentication error', async () => {
      const user = await prisma.user.create({
        data: { email: 'foo@wee.net', password: 'asdf', roles: { set: [Role.USER] } },
      });

      const variables = { email: user.email, password: 'fake' };
      const response = await graphQLRequest({ query, variables });
      const errorMessages = response.body.errors.map((e) => e.message);

      expect(errorMessages).toMatchInlineSnapshot(`
        Array [
          "Invalid password",
        ]
      `);
    });
  });

  describe('valid password', () => {
    it('returns the auth payload', async () => {
      const password = 'asdf';
      const hashedPassword = hashPassword(password);
      const user = await prisma.user.create({
        data: { email: 'foo@wee.net', password: hashedPassword, roles: { set: [Role.USER] } },
      });

      const variables = { email: user.email, password };
      const response = await graphQLRequest({ query, variables });

      expect(response.body).toMatchInlineSnapshot(`
        Object {
          "data": Object {
            "login": Object {
              "user": Object {
                "email": "foo@wee.net",
              },
            },
          },
        }
      `);
    });
  });
});
