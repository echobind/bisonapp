import terminalLink from "terminal-link";
import yargslib from "yargs";

export const command = "db <command>";
export const aliases = ["database"];
export const description = "Database scripts";

export const builder = (yargs: yargslib.Argv<{}>) =>
  yargs
    .commandDir("./dbCommands", {
      extensions: ["ts"],
    })
    .demandCommand()
    .epilogue(
      `Also see the ${terminalLink(
        "Redwood CLI Reference",
        "https://redwoodjs.com/reference/command-line-interface#db"
      )}`
    );
