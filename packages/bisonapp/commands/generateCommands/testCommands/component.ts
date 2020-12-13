import yargslib from "yargs";
import { handler as generateHandler } from "../../generate";
// import { runCLICommands } from "../../lib/helpers";

export const command = "component <name>";
export const description = "Generate a component test file";

export const builder = (_yargs: yargslib.Argv<{}>) => {};

export const handler = async () => {
  await generateHandler({ command: "test", subcommand: "component" });
};
