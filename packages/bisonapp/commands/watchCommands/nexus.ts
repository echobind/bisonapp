import yargslib from "yargs";
import execa from "execa";
import { DEFAULT_EXECA_ARGS } from "../../lib/helpers";

export const command = "nexus";
export const description = "Watch Nexus files";

export const builder = (_yargs: yargslib.Argv<{}>) => {};

export const handler = async () => {
  // use execa directly due to watch mode
  await execa(
    "yarn ts-node-dev",
    [
      "-P tsconfig.cjs.json",
      "--transpile-only",
      "--respawn",
      "--watch graphql/schema.ts,prisma/schema.prisma graphql/schema.ts",
    ],
    DEFAULT_EXECA_ARGS
  );
};
