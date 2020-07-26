import { graphQLRequest, graphQLRequestAsUser } from '../helpers';
import { prisma } from '../../lib/prisma';

describe('me query', () => {
  it('returns null if not logged in', async () => {
    const query = `
      query me {
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

  it('returns user data if logged in', async () => {
    const query = `
      query me {
        me {
          email
        }
      }
    `;

    const user = await prisma.user.create({ data: { email: 'foo@wee.net', password: 'asdf' } });
    const response = await graphQLRequestAsUser(user, { query });

    expect(response.body).toMatchInlineSnapshot(`
      Object {
        "data": Object {
          "me": Object {
            "email": "foo@wee.net",
          },
        },
      }
    `);
  });
});
