import yargslib from "yargs";

export const command = "build <command>";
export const description = "Build scripts";

export const builder = (yargs: yargslib.Argv<{}>) =>
  yargs.commandDir("./buildCommands", {
    extensions: ["js", "ts"],
  });

// bison test
// bison test --watch
// bison test e2e
// bison test e2e --local
// bison test --server
