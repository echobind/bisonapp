import yargslib from "yargs";
import { handler as generateHandler } from "../../generate";
// import { runCLICommands } from "../../lib/helpers";

export const command = "util <name>";
export const description = "Generate a util test file";

export const builder = (_yargs: yargslib.Argv<{}>) => {};

export const handler = async () => {
  // TODO: this should live on its own, not under test
  await generateHandler({ command: "test", subcommand: "factory" });
};
