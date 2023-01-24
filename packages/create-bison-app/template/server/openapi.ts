import { generateOpenApiDocument } from 'trpc-openapi';

import { appRouter } from './routers/_app';

// Generate OpenAPI schema document
export const openApiDocument = generateOpenApiDocument(appRouter, {
  title: 'Bison App',
  description: 'OpenAPI compliant REST API built using tRPC with Next.js',
  version: '1.0.0',
  baseUrl: 'http://localhost:3000/api',
  docsUrl: 'https://docs.my-site.com',
  tags: ['NextJS', 'Prisma', 'tRPC'],
});
