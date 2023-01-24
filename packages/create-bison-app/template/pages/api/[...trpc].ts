import cors from 'nextjs-cors';
import { createOpenApiNextHandler } from 'trpc-openapi';

import { NextApiRequest, NextApiResponse } from 'next';

import { appRouter } from '@/server/routers/_app';
import { createContext } from '@/server/context';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // Setup CORS
  await cors(req, res);

  // Handle incoming OpenAPI requests
  return createOpenApiNextHandler({
    router: appRouter,
    createContext,
  })(req, res);
};

export default handler;
