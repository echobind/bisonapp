import yargslib from "yargs";
import { runCLICommands } from "../../lib/helpers";
// import { handler as generatePrismaClient } from 'src/commands/dbCommands/generate'

export const command = "migrate";
export const description = "Generate the Prisma client and apply migrations";
export const builder = (yargs: yargslib.Argv<{}>) => {
  yargs
    .positional("increment", {
      description:
        "Number of forward migrations to apply. Defaults to the latest",
      type: "number",
    })
    .option("dbClient", {
      default: true,
      description: "Generate the Prisma client",
      type: "boolean",
    })
    .option("autoApprove", {
      default: false,
      description: "Skip interactive approval before migrating",
      type: "boolean",
    })
    .option("verbose", {
      alias: "v",
      default: true,
      description: "Print more",
      type: "boolean",
    });
};

// export const handler = async () => {
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
