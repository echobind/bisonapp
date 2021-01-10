import yargslib from "yargs";
import { runCLICommands } from "../../lib/helpers";

export const command = "next";
export const description = "Builds the Next app";

export const builder = (_yargs: yargslib.Argv<{}>) => {};

export const handler = async () => {
  await runCLICommands([
    {
      title: "Building Next.js app",
      cmd: "yarn next",
      args: ["build"],
    },
  ]);
};
