import { t } from '@/server/trpc';
import { isTesting } from '@/config';

const timingMiddleware = t.middleware(async ({ path, type, next }) => {
  // Don't log timing in tests.
  if (isTesting()) {
    return await next();
  }

  const start = Date.now();
  const result = await next();
  const durationMs = Date.now() - start;
  result.ok
    ? console.log('OK request timing:', { path, type, durationMs })
    : console.log('Non-OK request timing', { path, type, durationMs });

  return result;
});

export const timingProcedure = t.procedure.use(timingMiddleware);
