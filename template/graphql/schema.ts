import path from 'path';

import { fieldAuthorizePlugin, makeSchema } from '@nexus/schema';
import { nexusPrisma } from 'nexus-plugin-prisma';

import prettierConfig from '../prettier.config';

import * as types from './modules';

export const schema = makeSchema({
  types,
  plugins: [
    fieldAuthorizePlugin(),
    nexusPrisma({
      experimentalCRUD: true,
      outputs: {
        typegen: path.join(
          __dirname,
          '../node_modules/@types/typegen-nexus-plugin-prisma/index.d.ts'
        ),
      },
    }),
  ],
  outputs: {
    schema: path.join(__dirname, '../api.graphql'),
    typegen: path.join(__dirname, '../node_modules/@types/nexus-typegen/index.d.ts'),
  },
  typegenAutoConfig: {
    sources: [
      {
        source: path.join(__dirname, '../node_modules/.prisma/client/index.d.ts'),
        alias: 'db',
      },
      {
        source: path.join(__dirname, './context.ts'),
        alias: 'ContextModule',
      },
    ],
    contextType: 'ContextModule.Context',
  },
  prettierConfig,
});
