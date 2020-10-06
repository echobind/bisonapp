const fs = require("fs");
const path = require("path");
const execa = require("execa");
const { makeTempDir } = require("../utils/makeTempDir");
module.exports = {};

async function init() {
  const args = process.argv.slice(2);
  return await createApp(args);
}

async function createTmpDir() {
  const tmpDir = await makeTempDir();

  if (!fs.existsSync("./tmp")) {
    await fs.promises.mkdir("./tmp");
  }

  fs.writeFile("./tmp/tmpDir", tmpDir, () => {
    console.log("tmpDir location stored.");
  });

  return tmpDir;
}

async function createApp(args) {
  console.log("my args are", args);
  const tmpdir = await createTmpDir();
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

init();
