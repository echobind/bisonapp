import { settings, use } from 'nexus';
import { prisma } from 'nexus-plugin-prisma';

import { prisma as instance } from '../lib/prisma';
import './context';
import './user';
import './profile';

export const GRAPHQL_PATH = '/api/graphql';

// Enable nexus prisma plugin with crud features
use(prisma({ migrations: true, features: { crud: true }, client: { instance } }));

// Nexus Settings
// see: https://nexusjs.org/api/nexus/settings
settings.change({
  server: {
    playground: process.env.NODE_ENV !== 'production',
    path: '/api/graphql',
    cors: false,
  },
});
