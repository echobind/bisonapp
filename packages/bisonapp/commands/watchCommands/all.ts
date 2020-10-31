import yargslib from "yargs";
import execa from "execa";
import { DEFAULT_EXECA_ARGS } from "../../lib/helpers";

export const command = "$0";
export const description = "Run all watchers";

export const builder = (_yargs: yargslib.Argv<{}>) => {};

export const handler = async () => {
  // use execa directly due to watch mode
  await execa(
    "yarn concurrently",
    [
      '-n "NEXUS,GQLCODEGEN,TYPESCRIPT"',
      '-c "black.bgGreen.dim,black.bgBlue.dim,white.bgMagenta.dim"',
      "'yarn bison watch nexus'",
      "'yarn bison watch codegen'",
      "'yarn bison watch ts'",
    ],
    DEFAULT_EXECA_ARGS
  );
};
