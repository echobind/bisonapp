import yargslib from "yargs";
import { runCLICommands } from "../../lib/helpers";
// import { handler as generatePrismaClient } from 'src/commands/dbCommands/generate'

export const command = "migrate";
export const description = "Generate the Prisma client and apply migrations";

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
      title: "Migrate database up...",
      cmd: "yarn prisma",
      args: ["migrate up", "--experimental", "--create-db"].filter(Boolean),
    },
  ]);

  if (success && dbClient) {
    // TODO
    // await generatePrismaClient({ force: true, verbose });
  }
};
