import yargslib from "yargs";
import { runCLICommands } from "../../lib/helpers";
import { handler as generatePrismaClient } from "../buildCommands/prisma";

export const command = "test";
export const description = "Migrate the database";

export const builder = (yargs: yargslib.Argv<{}>) => {
  yargs.option("request", {
    default: false,
    description: "Generate an API request test",
    type: "boolean",
  });
  yargs.option("component", {
    default: false,
    description: "Generate a component unit test",
    type: "boolean",
  });
  yargs.option("util", {
    default: false,
    description: "Generate a util unit test",
    type: "boolean",
  });
};

export const handler = async ({ dbClient = true }) => {
  const success = await runCLICommands([
    {
      title: "Migrate database up...",
      cmd: "yarn prisma",
      args: ["migrate up", "--experimental"].filter(Boolean),
    },
  ]);

  if (success && dbClient) {
    await generatePrismaClient();
  }
};
