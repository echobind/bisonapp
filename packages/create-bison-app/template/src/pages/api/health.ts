import { NextApiRequest, NextApiResponse } from 'next';

import { env } from '~/src/env.mjs';
import { prisma } from '@/lib/prisma';

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  let databaseWorking = false;

  try {
    await prisma.user.findFirst();
    databaseWorking = true;
  } catch (err) {}

  const data = {
    stage: env.APP_ENV,
    env: {
      NODE_ENV: env.NODE_ENV,
      NEXT_PUBLIC_APP_ENV: env.NEXT_PUBLIC_APP_ENV,
      SHOULD_MIGRATE: env.SHOULD_MIGRATE,
      FC_GIT_COMMIT_SHA: env.FC_GIT_COMMIT_SHA,
    },
    status: {
      database: databaseWorking,
    },
  };

  const healthy = databaseWorking;

  const statusCode = healthy ? 200 : 503;

  res.status(statusCode).json(data);
}
