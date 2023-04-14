const path = require("path");
const cpy = require("cpy");
const fs = require("fs");

const { copyWithTemplate } = require("../utils/copyWithTemplate");
const {
  copyDirectoryWithTemplate,
} = require("../utils/copyDirectoryWithTemplate");

const templateFolder = path.join(__dirname, "..", "template");
const fromPath = (file) => path.join(templateFolder, file);

/**
 * Copies files based on variables and a target folder
 */
async function copyFiles({ variables, targetFolder }) {
  const toPath = (file) => path.join(targetFolder, file);

  // Files to render when using Heroku
  const isHeroku = variables.host.name === "heroku";
  let herokuFiles = [];

  if (isHeroku) {
    herokuFiles = [
      copyWithTemplate(fromPath("app.json"), toPath("app.json"), variables),
      copyWithTemplate(fromPath("Procfile"), toPath("Procfile"), variables),
    ];
  }

  return Promise.all([
    fs.promises.mkdir(targetFolder),

    copyWithTemplate(
      fromPath("package.json.ejs"),
      toPath("package.json"),
      variables
    ),

    copyWithTemplate(fromPath("README.md.ejs"), toPath("README.md"), variables),
    copyWithTemplate(fromPath("_.gitignore"), toPath(".gitignore"), variables),

    copyWithTemplate(fromPath("_.env.ejs"), toPath(".env"), variables),

    copyWithTemplate(
      fromPath("_.env.local.ejs"),
      toPath(".env.local"),
      variables
    ),

    copyWithTemplate(
      fromPath("_.env.development.ejs"),
      toPath(".env.local"),
      variables
    ),

    copyWithTemplate(
      fromPath("_.env.development.local.ejs"),
      toPath(".env.development.local"),
      variables
    ),

    copyWithTemplate(
      fromPath("_.env.test.ejs"),
      toPath(".env.test"),
      variables
    ),

    copyWithTemplate(
      fromPath("_.env.test.local.ejs"),
      toPath(".env.test"),
      variables
    ),

    copyDirectoryWithTemplate(
      fromPath(".github"),
      toPath(".github"),
      variables
    ),

    copyDirectoryWithTemplate(fromPath("pages"), toPath("pages"), variables),
    copyDirectoryWithTemplate(fromPath("prisma"), toPath("prisma"), variables),

    copyDirectoryWithTemplate(fromPath("server"), toPath("server"), variables),

    copyDirectoryWithTemplate(fromPath("tests"), toPath("tests"), variables),

    ...herokuFiles,

    cpy(
      [
        "__mocks__",
        "_templates",
        ".vscode",
        "components",
        "context",
        "hooks",
        "layouts",
        "lib",
        "prisma",
        "public",
        "scripts",
        "services",
        "styles",
        "types",
        "utils",
        ".eslintrc.js",
        ".hygen.js",
        ".nvmrc",
        ".tool-versions",
        "constants.ts",
        "jest.config.js",
        "playwright.config.ts",
        "next-env.d.ts",
        "prettier.config.js",
        "tsconfig.json",
        "tsconfig.cjs.json",
        "tailwind.config.js",
        "postcss.config.js",
      ],
      targetFolder,
      {
        cwd: templateFolder,
        dot: true,
        // preserve path
        parents: true,
      }
    ),
  ]);
}

module.exports = {
  copyFiles,
  templateFolder,
};
