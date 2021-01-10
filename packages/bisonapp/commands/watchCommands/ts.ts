import yargslib from "yargs";
import execa from "execa";
import { DEFAULT_EXECA_ARGS } from "../../lib/helpers";

export const command = "ts";
export const description = "Watch ts files";

export const builder = (_yargs: yargslib.Argv<{}>) => {};

export const handler = async () => {
  // use execa directly due to watch mode
  await execa("yarn tsc", ["--noEmit", "--watch"], DEFAULT_EXECA_ARGS);
};
