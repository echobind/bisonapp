import { schema } from 'nexus';

import { prisma } from '../lib/prisma';
import { verifyAuthHeader } from '../services/auth';

schema.addToContext(async (req) => {
  const authHeader = verifyAuthHeader(req.headers.authorization);
  let user = null;

  if (authHeader) {
    user = await prisma.user.findOne({ where: { id: authHeader.userId } });
  }

  return { user };
});
