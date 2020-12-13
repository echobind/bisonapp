import yargslib from "yargs";
import { runCLICommands } from "../lib/helpers";

export const command = "generate <command> [subcommand] <name>";
export const aliases = ["g"];
export const description = "Generate app code";

// export const builder = (yargs: yargslib.Argv<{}>) =>
//   yargs
//   .commandDir("./generateCommands", {
//     extensions: ["ts"],
//   })
//   .demandCommand();

interface Options {
  command: string;
  subcommand?: string;
}

const DEFAULT_SUBCOMMAND = "new";

export const builder = (yargs: yargslib.Argv<{}>) => {
  yargs
    .commandDir("./generateCommands", {
      extensions: ["js", "ts"],
    })
    .option("command", {
      description: "The generator to run",
      type: "string",
      hidden: true,
    })
    .option("subcommand", {
      description: "The subcommand",
      type: "string",
      default: DEFAULT_SUBCOMMAND,
      hidden: true,
    })
    .demandCommand();
};

export const handler = async ({
  command,
  subcommand = DEFAULT_SUBCOMMAND,
}: Options) => {
  await runCLICommands([
    {
      title: `Generating ${subcommand} ${command}`,
      cmd: "yarn hygen",
      args: [command, subcommand, "--name"].filter(Boolean),
    },
  ]);
};
