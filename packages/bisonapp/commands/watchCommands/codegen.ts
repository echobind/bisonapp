import yargslib from "yargs";
import execa from "execa";
import { DEFAULT_EXECA_ARGS } from "../../lib/helpers";

export const command = "codegen";
export const description = "Watch Codegen files";

export const builder = (_yargs: yargslib.Argv<{}>) => {};

export const handler = async () => {
  // use execa directly due to watch mode
  await execa(
    "yarn graphql-codegen",
    ["--config", "codegen.yml", "--watch"],
    DEFAULT_EXECA_ARGS
  );
};
