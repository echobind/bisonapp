import { settings, use } from 'nexus';
import { prisma } from 'nexus-plugin-prisma';
import { prisma as client } from '../lib/prisma';
import './context';
import './user';

// Enable nexus prisma plugin with crud features
use(prisma({ migrations: true, features: { crud: true } }));

// Nexus Settings
// see: https://nexusjs.org/api/nexus/settings
settings.change({
  server: {
    playground: process.env.NODE_ENV !== 'production',
    path: '/api/graphql',
  },
});
