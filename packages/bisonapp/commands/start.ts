import yargslib from "yargs";
import execa from "execa";
import { DEFAULT_EXECA_ARGS } from "../lib/helpers";

export const command = "start";
export const description = "Start the server";

export const builder = (_yargs: yargslib.Argv<{}>) => {};

export const handler = async () => {
  // use execa directly due to watch mode
  await execa("yarn next start", ["-p $PORT"], DEFAULT_EXECA_ARGS);
};
