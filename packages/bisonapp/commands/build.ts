import yargslib from "yargs";

export const command = "build <command>";
export const description = "Build scripts";

export const builder = (yargs: yargslib.Argv<{}>) =>
  yargs.commandDir("./buildCommands", {
    extensions: ["ts"],
  });
// .demandCommand();
