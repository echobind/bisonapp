const { promisify } = require("util");
const os = require("os");
const path = require("path");
const mkdtemp = promisify(require("fs").mkdtemp);
const execa = require("execa");
module.exports = {};

async function createAppAndStartServer() {
  const args = process.argv.slice(2);
  const appDir = await createApp(args);
  return startServer(appDir);
}

async function createApp(args) {
  console.log("my args are", args);
  const tmpdir = await mkdtemp(`${os.tmpdir()}${path.sep}`);
  const cliPath = path.join(__dirname, "..", "cli.js");

  const cliOptions = args.length ? args : ["myapp", "--acceptDefaults"];
  const name = cliOptions.splice(0, 1)[0];

  console.log("cli options are", cliOptions);
  console.log("cli path", cliPath);
  console.log("installing to:", tmpdir);
  console.log("nodeargs", [cliPath, name, ...cliOptions]);

  await execa("node", [cliPath, name, ...cliOptions], {
    cwd: tmpdir,
    stdio: "inherit",
  });

  return path.join(tmpdir, name);
}

function startServer(cwd) {
  return execa(`yarn next dev --port 3001`, {
    cwd,
    stdio: "inherit",
    shell: true,
  });
}

createAppAndStartServer();
