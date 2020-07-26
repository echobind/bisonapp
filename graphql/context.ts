import { schema } from 'nexus';
import { prisma } from '../lib/prisma';

schema.addToContext(async (req) => {
  // const authHeader = verifyAuthHeader(req.headers.authorization);
  const authHeader = null;
  let user = null;

  if (authHeader) {
    user = await prisma.user.findOne({ where: { id: authHeader.userId } });
  }

  return { user };
});
