import yargslib from "yargs";
import { runCLICommands } from "../../lib/helpers";
import { handler as generatePrismaClient } from "../buildCommands/prisma";

export const command = "migrate";
export const description = "Migrate the database";

export const builder = (yargs: yargslib.Argv<{}>) => {
  yargs.option("dbClient", {
    default: true,
    description: "Generate the Prisma client",
    type: "boolean",
  });
};

export const handler = async ({ dbClient = true }) => {
  let args = ["migrate up", "--experimental"];
  if (process.env.CI) args.push("--auto-approve");

  const success = await runCLICommands([
    {
      title: "Migrate database up...",
      cmd: "yarn prisma",
      args: args.filter(Boolean),
    },
  ]);

  if (success && dbClient) {
    await generatePrismaClient();
  }
};
