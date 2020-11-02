import yargslib from "yargs";
// import { runCLICommands } from "../../lib/helpers";
// import { handler as generatePrismaClient } from "../buildCommands/prisma";

export const command = "drop";
export const description = "Drop the database";

export const builder = (_yargs: yargslib.Argv<{}>) => {};

export const handler = async () => {
  // TODO: buiildProd script
  // const success = await runCLICommands([
  //   {
  //     title: "Migrate database up...",
  //     cmd: "yarn prisma",
  //     args: ["migrate up", "--experimental"].filter(Boolean),
  //   },
  // ]);
};
