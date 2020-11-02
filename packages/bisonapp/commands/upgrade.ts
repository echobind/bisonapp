import yargslib from "yargs";
// import { runCLICommands } from "../lib/helpers";
// import { promisify } from "util";
// import { spawn as childSpawn } from "child_process";
// import { spawnSync } from "child_process";
import Listr from "listr";
// import execa from "execa";
import updateNotifier from "update-notifier";
import boxen from "boxen";

// const spawn = promisify(childSpawn);

export const command = "upgrade";
export const aliases = ["u"];
export const description = "Helps upgrade a Bison app";

export const builder = (_yargs: yargslib.Argv<{}>) => {
  // const cwd = path.join(__dirname, "../../../");
  // yargs.option("branches", { type: "string" }).pkgConf("bison", cwd);
};

export const handler = async () => {
  const tasks = new Listr([
    {
      title: "Determining Latest Version",
      task: async (ctx) => {
        // Get version of this package (assumes create-bison-app is the same)
        const { version } = require("../package.json");

        // Determine latest version
        const notifier = updateNotifier({
          pkg: {
            name: "create-bison-app",
            version,
          },
          // distTag: "canary",
          updateCheckInterval: 0,
        });

        const info = await notifier.fetchInfo();
        ctx.info = info;
      },
    },
  ]);

  const { info } = await tasks.run();

  const message = `To upgrade from ${info.current} to ${info.latest}:
  https://github.com/echobind/bisonapp-versions/compare/v${info.current}...v${info.latest}
  `;

  console.log(
    boxen(message, {
      borderStyle: boxen.BorderStyle.Round,
      float: "left",
      align: "center",
      margin: 2,
      padding: 1,
    })
  );
};
