const chokidar = require("chokidar");
const execa = require("execa");
const fs = require("fs");
const path = require("path");
const yargs = require("yargs/yargs");
const { createApp } = require("../scripts/createApp");
const { templateFolder } = require("../tasks/copyFiles");
const { cleanTemplateDestPath } = require("../utils/copyDirectoryWithTemplate");
const { copyWithTemplate } = require("../utils/copyWithTemplate");
const { getDevAppVariables } = require("../utils/devAppVariables");

const BISON_DEV_APP_NAME = "bison-dev-app";

async function init() {
  const distPath = path.join(__dirname, "..", "dist");
  const devAppPath = path.join(distPath, BISON_DEV_APP_NAME);
  const args = process.argv.slice(2);
  const { _, clean } = yargs(args).argv;

  // Script in the template's package.json to run
  const templateCommand = _.length ? _[0] : 'dev';

  if (clean) {
    await removeTemplateSymlinks();
    await fs.promises.rm(devAppPath, { force: true, recursive: true });
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

  const templateVariables = getDevAppVariables(devAppPath);

  const copyFile = async (src) => {
    const relativeSrc = src.replace(templateFolder, "");
    const isHygenTemplate = src.match(/_templates\//);
    const dest = path.join(
      devAppPath,
      isHygenTemplate ? relativeSrc : cleanTemplateDestPath(relativeSrc)
    );
    if (src.match(/\.ejs$/) && !isHygenTemplate) {
      await copyWithTemplate(src, dest, templateVariables);
    } else {
      await fs.promises.copyFile(src, dest);
    }
  };

  if (templateCommand === 'dev') {
    // Watch template files and copy to dev app
    chokidar
      .watch(templateFolder, {
        ignored: (path) => path.includes("node_modules"),
      })
      .on("add", copyFile)
      .on("change", copyFile);
  }

  return await execa(`yarn ${templateCommand}`, {
    cwd: devAppPath,
    shell: true,
    stdio: "inherit",
  });
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
    const lstat = fs.lstatSync(filePath, { throwIfNoEntry: false });
    if (lstat && lstat.isSymbolicLink()) {
      await fs.promises.unlink(filePath);
    }
  };

  await unlinkFile("api.graphql");
  await unlinkFile("types.ts");

  // Directories cannot be "unlinked" so they must be removed
  await fs.promises.rm(templatePath("node_modules"), { force: true, recursive: true });
  await fs.promises.rm(templatePath("types"), { force: true, recursive: true });
}

if (require.main === module) {
  init();
}
