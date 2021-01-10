import yargslib from "yargs";

export const command = "db <command>";
export const aliases = ["database"];
export const description = "Database scripts";

export const builder = (yargs: yargslib.Argv<{}>) =>
  yargs
    .commandDir("./dbCommands", {
      extensions: ["js", "ts"],
    })
    .demandCommand();
