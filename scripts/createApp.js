const path = require("path");
const execa = require("execa");
const core = require("@actions/core");
const { makeTempDir } = require("../utils/makeTempDir");
module.exports = {};

async function init() {
  const args = process.argv.slice(2);
  return await createApp(args);
}

async function createApp(args) {
  const tmpdir = await makeTempDir();
  const cliPath = path.join(__dirname, "..", "cli.js");

  const cliOptions = args.length ? args : ["myapp", "--acceptDefaults"];
  const name = cliOptions.splice(0, 1)[0];

  await execa("node", [cliPath, name, ...cliOptions], {
    cwd: tmpdir,
    stdio: "inherit",
  });

  const appPath = path.join(tmpdir, name);
  core.debug(`app name: ${name}`);
  core.setOutput("appName", name);
  core.debug(`app path: ${appPath}`);
  core.setOutput("appPath", appPath);

  return appPath;
}

init();
