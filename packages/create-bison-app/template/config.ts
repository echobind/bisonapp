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

function envToString(value: string | undefined, defaultValue = '') {
  return value === undefined ? defaultValue : value;
}

/*
function envToNumber(value: string | undefined, defaultValue: number): number {
  return value === undefined || value === '' ? defaultValue : Number(value);
}
*/

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

const stage = getStage(
  [process.env.NODE_ENV, process.env.NEXT_PUBLIC_APP_ENV].filter(notEmpty).filter(isStage)
);

// NOTE: Remember that only env variables that start with NEXT_PUBLIC or are
// listed in next.config.js will be available on the client.
export const config = {
  stage,
  ci: {
    isCi: envToBoolean(process.env.CI),
    isPullRequest: envToBoolean(process.env.IS_PULL_REQUEST),
  },
  database: {
    url: envToString(process.env.DATABASE_URL),
    shouldMigrate: envToBoolean(process.env.SHOULD_MIGRATE),
  },
  git: {
    commit: envToString(process.env.FC_GIT_COMMIT_SHA || process.env.RENDER_GIT_COMMIT),
  },
  auth: {
    secret: envToString(process.env.NEXTAUTH_SECRET),
  },
};
