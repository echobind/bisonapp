import yargslib from "yargs";
import Listr from "listr";
import updateNotifier from "update-notifier";
import boxen from "boxen";
import terminalLink from "terminal-link";

// const spawn = promisify(childSpawn);

export const command = "upgrade";
export const aliases = ["u"];
export const description = "Helps upgrade a Bison app";

export const builder = (_yargs: yargslib.Argv<{}>) => {};

export const handler = async () => {
  const tasks = new Listr([
    {
      title: "Determining Latest Version",
      task: async (ctx) => {
        // Get version of this package (assumes create-bison-app is the same)
        const { version } = require("../../package.json");

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

  const githubUrl = `https://github.com/echobind/bisonapp-versions/compare/v${info.current}...v${info.latest}`;

  const message = `Upgrade from ${info.current} to ${info.latest} on GitHub:
${terminalLink(
  `echobind/bisonapp-versions/compare/v${info.current}...v${info.latest}`,
  githubUrl,
  { fallback: true }
)}`;

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
