import { settings, use } from "nexus";
import { prisma } from "nexus-plugin-prisma";
import "./user";

use(prisma());

// Nexus Settings
// see: https://nexusjs.org/api/nexus/settings
settings.change({
  server: {
    playground: process.env.NODE_ENV !== "production",
    path: "/api/graphql",
  },
});
