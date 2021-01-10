import yargslib from "yargs";
import { runCLICommands } from "../../lib/helpers";

interface Options {
  schemaPath?: string;
}

export const command = "nexus";
export const description = "Builds the GraphQL schema and generates types.";

const DEFAULT_SCHEMA_PATH = "graphql/schema.ts";

export const builder = (yargs: yargslib.Argv<{}>) => {
  yargs.option("schemaPath", {
    default: DEFAULT_SCHEMA_PATH,
    description: "The path to the graphql schema",
    type: "string",
  });
};

export const handler = async ({
  schemaPath = DEFAULT_SCHEMA_PATH,
}: Options = {}) => {
  await runCLICommands([
    {
      title: "Generating GraphQL schema and types",
      cmd: "NODE_ENV=development ts-node",
      args: [
        '--compiler-options \'{"module":"commonjs"}\'',
        "--transpile-only",
        schemaPath,
      ].filter(Boolean),
    },
  ]);
};
