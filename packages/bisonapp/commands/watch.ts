import yargslib from "yargs";

export const command = "watch <command>";
export const description = "Watch scripts";
export const aliases = ["w"];

export const builder = (yargs: yargslib.Argv<{}>) =>
  yargs.commandDir("./watchCommands", {
    extensions: ["js", "ts"],
  });
