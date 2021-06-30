const chokidar = require("chokidar");
const execa = require("execa");
const fs = require("fs");
const path = require("path");
const yargs = require("yargs/yargs");
const { createApp } = require("../scripts/createApp");
const { startServer } = require("../scripts/startServer");
const { templateFolder } = require("../tasks/copyFiles");
const { cleanTemplateDestPath } = require("../utils/copyDirectoryWithTemplate");
const { copyWithTemplate } = require("../utils/copyWithTemplate");

const BISON_DEV_APP_NAME = "bison-dev-app";
const BISON_DEV_APP_VARIABLES_FILE = "bison.json";

async function init() {
  const distPath = path.join(__dirname, "..", "dist");
  const devAppPath = path.join(distPath, BISON_DEV_APP_NAME);
  const args = process.argv.slice(2);
  const { clean, port } = yargs(args).argv;

  if (clean) {
    await fs.promises.rmdir(devAppPath, { recursive: true });
    await removeTemplateSymlinks();
  }

  // Create bison app if it does not exist
  if (!fs.existsSync(devAppPath)) {
    if (!fs.existsSync(distPath)) {
      await fs.promises.mkdir(distPath);
    }

    await createApp([BISON_DEV_APP_NAME, ...args], distPath);

    await execa("yarn setup:dev", {
      cwd: devAppPath,
      shell: true,
      stdio: "inherit",
    });

    await createTemplateSymlinks(devAppPath);
  }

  const templateVariables = require(path.join(
    devAppPath,
    BISON_DEV_APP_VARIABLES_FILE
  ));

  const copyFile = async (src) => {
    const relativeSrc = cleanTemplateDestPath(src.replace(templateFolder, ""));
    const dest = path.join(devAppPath, relativeSrc);
    if (src.match(/\.ejs$/) && !src.match(/_templates\//)) {
      await copyWithTemplate(src, dest, templateVariables);
    } else {
      await fs.promises.copyFile(src, dest);
    }
  };

  // Watch template files and copy to dev app
  chokidar
    .watch(templateFolder, {
      ignored: (path) => path.includes("node_modules"),
    })
    .on("add", copyFile)
    .on("change", copyFile);

  return startServer(devAppPath, port);
}

/**
 * Create symbolic links to node_modules and generated files in the dev app so
 * the template directory files won't contain errors
 */
async function createTemplateSymlinks(appPath) {
  // Files and directories that do not exist in template that need to be linked
  const relativeAppPaths = ["api.graphql", "node_modules", "types", "types.ts"];

  for (const relativePath of relativeAppPaths) {
    await fs.promises.symlink(
      path.join(appPath, relativePath),
      path.join(templateFolder, relativePath)
    );
  }
}

/**
 * Remove all symlinks in the template directory
 */
async function removeTemplateSymlinks() {
  const templatePath = (relativePath) =>
    path.join(templateFolder, relativePath);
  const unlinkFile = async (filename) => {
    const filePath = templatePath(filename);
    if (fs.existsSync(filePath) && fs.lstatSync(filePath).isSymbolicLink()) {
      await fs.promises.unlink(filePath);
    }
  };

  await unlinkFile("api.graphql");
  await unlinkFile("types.ts");

  // Directories cannot be "unlinked" so they must be removed
  await fs.promises.rmdir(templatePath("node_modules"), { recursive: true });
  await fs.promises.rmdir(templatePath("types"), { recursive: true });
}

if (require.main === module) {
  init();
}

module.exports = {
  BISON_DEV_APP_VARIABLES_FILE,
};
