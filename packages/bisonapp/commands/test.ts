import yargslib from "yargs";

export const command = "test <command>";
export const description = "Test scripts";
export const aliases = ["t"];

export const builder = (yargs: yargslib.Argv<{}>) =>
  yargs.commandDir("./testCommands", {
    extensions: ["js", "ts"],
  });
