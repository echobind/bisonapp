import yargslib from "yargs";
import { handler as generateHandler } from "../generate";

export const command = "factory <name>";
export const description = "Generate a factory used in tests";

export const builder = (_yargs: yargslib.Argv<{}>) => {};

export const handler = async () => {
  await generateHandler({ command: "test", subcommand: "factory" });
};
