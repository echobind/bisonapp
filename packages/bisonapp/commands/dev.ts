import yargslib from "yargs";
import execa from "execa";
import { DEFAULT_EXECA_ARGS } from "../lib/helpers";

export const command = "dev";
export const description = "Dev scripts";

export const builder = (_yargs: yargslib.Argv<{}>) => {};

export const handler = async () => {
  const args = [
    '-n "WATCHERS,NEXT"',
    '-c "black.bgYellow.dim,black.bgCyan.dim"',
    "'yarn bison watch'",
    "'yarn next dev'",
  ];

  // use execa directly due to watch mode
  await execa("yarn concurrently", args, DEFAULT_EXECA_ARGS);
};
