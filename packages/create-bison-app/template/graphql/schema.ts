import path from 'path';

import { declarativeWrappingPlugin, fieldAuthorizePlugin, makeSchema } from 'nexus';

import * as types from './modules';

import prettierConfig from '@/prettier.config';

const currentDirectory = process.cwd();

export const schema = makeSchema({
  types,
  plugins: [fieldAuthorizePlugin(), declarativeWrappingPlugin()],
  outputs: {
    schema: path.join(currentDirectory, 'api.graphql'),
    typegen: path.join(currentDirectory, 'types', 'nexus.d.ts'),
  },
  contextType: {
    module: path.join(currentDirectory, 'graphql', 'context.ts'),
    export: 'Context',
  },
  sourceTypes: {
    modules: [
      {
        module: '.prisma/client',
        alias: 'PrismaClient',
      },
    ],
  },
  prettierConfig,
});
