import { schema } from 'nexus';

import { prisma } from '../lib/prisma';
import { verifyAuthHeader } from '../services/auth';

schema.addToContext(async (data) => {
  const authHeader = verifyAuthHeader((data as any).req.headers.authorization);
  let user = null;

  if (authHeader) {
    user = await prisma.user.findOne({ where: { id: authHeader.userId } });
  }

  return { user };
});
