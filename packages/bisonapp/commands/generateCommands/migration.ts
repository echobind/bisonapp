import { runCLICommands } from "lib/helpers";
import yargslib from "yargs";

export const command = "migration <name>";
export const description = "Generate a new migration";

export const builder = (_yargs: yargslib.Argv<{}>) => {};

export const handler = async () => {
  await runCLICommands([
    {
      title: `Generating a new migration`,
      cmd: "yarn prisma",
      args: ["migrate", "save", "--experimental"].filter(Boolean),
    },
  ]);
};
