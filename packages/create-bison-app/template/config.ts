import { z } from 'zod';

import { notEmpty } from './lib/type-witchcraft';

const stages = ['production', 'development', 'test'] as const;

type Stage = (typeof stages)[number];

function getStage(stages: Stage[]) {
  if (!stages.length) return 'development';

  for (const stage of stages) {
    // if any of the provided stages is not production, assume we aren't in production
    if (stage !== 'production') {
      return stage;
    }
  }

  return stages[0];
}

function isStage(potentialStage: string): potentialStage is Stage {
  return stages.includes(potentialStage as Stage);
}

function envToBoolean(value: string | undefined, defaultValue = false): boolean {
  if (value === undefined || value === '') {
    return defaultValue;
  }

  // Explicitly test for true instead of false because we don't want to turn
  // something on by accident.
  return ['1', 'true'].includes(value.trim().toLowerCase()) ? true : false;
}

export function isProduction() {
  return stage === 'production';
}

export function isDevelopment() {
  return stage === 'development';
}

export function isTesting() {
  return stage === 'test';
}

export function isLocal() {
  return isDevelopment() || isTesting();
}

// a bit more versatile form of boolean coercion than zod provides
const coerceBoolean = z
  .string()
  .optional()
  .transform((value) => envToBoolean(value))
  .pipe(z.boolean());

const configSchema = z.object({
  stage: z.enum(stages),
  ci: z.object({
    isCi: coerceBoolean,
    isPullRequest: coerceBoolean,
  }),
  database: z.object({
    url: z.string(),
    shouldMigrate: coerceBoolean,
  }),
  auth: z.object({
    secret: z.string(),
  }),
});

const stage = getStage(
  [process.env.NODE_ENV, process.env.NEXT_PUBLIC_APP_ENV].filter(notEmpty).filter(isStage)
);

// NOTE: Remember that only env variables that start with NEXT_PUBLIC or are
// listed in next.config.js will be available on the client.
export const config = configSchema.parse({
  stage,
  ci: {
    isCi: process.env.CI,
    isPullRequest: process.env.IS_PULL_REQUEST,
  },
  database: {
    url: process.env.DATABASE_URL,
    shouldMigrate: process.env.SHOULD_MIGRATE,
  },
  git: {
    commit: process.env.FC_GIT_COMMIT_SHA || process.env.RENDER_GIT_COMMIT,
  },
  auth: {
    secret: process.env.NEXTAUTH_SECRET,
  },
});
