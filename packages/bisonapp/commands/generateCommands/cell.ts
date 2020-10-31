import yargslib from "yargs";
import { handler as generateHandler } from "../generate";

export const command = "graphql <name>";
export const description = "Generate a graphql module";

export const builder = (_yargs: yargslib.Argv<{}>) => {};

export const handler = async () => {
  await generateHandler({ command: "cell" });
};
