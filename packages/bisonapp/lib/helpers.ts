import Listr from "listr";
import execa, { Options } from "execa";
import chalk from "chalk";

interface Command {
  title: string;
  cmd: string;
  args?: string[];
  opts?: Options<string>;
}

export const DEFAULT_EXECA_ARGS: Options<string> = {
  shell: true,
  stdio: "inherit",
  extendEnv: true,
  cleanup: true,
};

export const runCLICommands = async (commands: Command[] = []) => {
  const tasks = new Listr(
    commands.map(({ title, cmd, args, opts = {} }) => ({
      title,
      task: async () => {
        return execa(cmd, args, {
          ...DEFAULT_EXECA_ARGS,
          ...opts,
        });
      },
    }))
  );

  try {
    await tasks.run();
    return true;
  } catch (e) {
    console.log(chalk.bold.red(e.message));
    return false;
  }
};
