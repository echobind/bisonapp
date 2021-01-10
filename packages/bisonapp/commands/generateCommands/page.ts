import yargslib from "yargs";
import { handler as generateHandler } from "../generate";

export const command = "page <name>";
export const description = "Generate a new page";

export const builder = (_yargs: yargslib.Argv<{}>) => {};

export const handler = async () => {
  await generateHandler({ command: "page" });
};
