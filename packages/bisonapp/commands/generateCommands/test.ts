import yargslib from "yargs";

export const command = "test <type> <name>";
export const description = "Generate a test file";

export const builder = (yargs: yargslib.Argv<{}>) => {
  yargs.commandDir("./testCommands", {
    extensions: ["js", "ts"],
  });
};
