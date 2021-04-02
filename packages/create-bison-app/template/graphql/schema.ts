import path from 'path';

import { declarativeWrappingPlugin, fieldAuthorizePlugin, makeSchema } from 'nexus';
import { nexusPrisma } from 'nexus-plugin-prisma';

import prettierConfig from '../prettier.config';

import * as types from './modules';

const currentDirectory = process.cwd();

export const schema = makeSchema({
  types,
  plugins: [
    fieldAuthorizePlugin(),
    declarativeWrappingPlugin(),
    nexusPrisma({
      experimentalCRUD: true,
      outputs: {
        typegen: path.join(
          currentDirectory,
          'node_modules/@types/typegen-nexus-plugin-prisma/index.d.ts'
        ),
      },
    }),
  ],
  outputs: {
    schema: path.join(currentDirectory, 'api.graphql'),
    typegen: path.join(currentDirectory, 'node_modules/@types/nexus-typegen/index.d.ts'),
  },
  sourceTypes: {
    modules: [
      {
        module: path.join(currentDirectory, 'node_modules/.prisma/client/index.d.ts'),
        alias: 'db',
      },
      {
        module: path.join(currentDirectory, 'graphql', 'context.ts'),
        alias: 'ContextModule',
      },
    ],
  },
  prettierConfig,
});
