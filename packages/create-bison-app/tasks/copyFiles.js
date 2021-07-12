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
      fromPath("_.env.test.ejs"),
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

    copyDirectoryWithTemplate(
      fromPath("graphql"),
      toPath("graphql"),
      variables
    ),

    copyDirectoryWithTemplate(fromPath("tests"), toPath("tests"), variables),

    ...herokuFiles,

    cpy(
      [
        "_templates",
        ".vscode",
        "chakra",
        "components",
        "context",
        "cypress",
        "layouts",
        "lib",
        "prisma",
        "public",
        "scripts",
        "services",
        "utils",
        ".eslintrc.js",
        ".hygen.js",
        ".tool-versions",
        "codegen.yml",
        "constants.ts",
        "cypress.json",
        "jest.config.js",
        "next-env.d.ts",
        "prettier.config.js",
        "tsconfig.json",
      ],
      targetFolder,
      {
        cwd: templateFolder,
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
