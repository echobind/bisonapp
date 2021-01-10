import yargslib from "yargs";
import { runCLICommands } from "../../lib/helpers";

export const command = "prisma";
export const description = "Generates the Prisma client";

export const builder = (_yargs: yargslib.Argv<{}>) => {};

export const handler = async () => {
  await runCLICommands([
    {
      title: "Generating Prisma Client",
      cmd: "yarn prisma",
      args: ["generate"],
    },
  ]);
};
