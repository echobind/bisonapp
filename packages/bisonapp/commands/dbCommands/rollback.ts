import yargslib from "yargs";
import { runCLICommands } from "../../lib/helpers";
import { handler as generatePrismaClient } from "../buildCommands/prisma";

export const command = "rollback";
export const description = "Rollback recent database migrations";

export const builder = (yargs: yargslib.Argv<{}>) => {
  yargs.option("dbClient", {
    default: true,
    description: "Generate the Prisma client",
    type: "boolean",
  });
};

export const handler = async ({ dbClient = true }) => {
  const success = await runCLICommands([
    {
      title: "Migrate database down...",
      cmd: "yarn prisma",
      args: ["migrate down", "--experimental"].filter(Boolean),
    },
  ]);

  if (success && dbClient) {
    await generatePrismaClient();
  }
};
