import { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from '@/lib/prisma';

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  let databaseWorking = false;

  try {
    await prisma.user.findFirst();
    databaseWorking = true;
  } catch (err) {}

  const data = {
    env: {
      NODE_ENV: process.env.NODE_ENV,
      NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV,
      SHOULD_MIGRATE: process.env.SHOULD_MIGRATE,
      FC_GIT_COMMIT_SHA: process.env.FC_GIT_COMMIT_SHA,
    },
    status: {
      database: databaseWorking,
    },
  };

  const healthy = databaseWorking;

  const statusCode = healthy ? 200 : 503;

  res.status(statusCode).json(data);
}
