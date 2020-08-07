"use strict";
const { promisify } = require("util");
const path = require("path");
const fs = require("fs");
const replaceString = require("replace-string");
const slugify = require("slugify");
const execa = require("execa");
const Listr = require("listr");
const cpy = require("cpy");

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const deleteFile = promisify(fs.unlink);

const copyWithTemplate = async (from, to, variables) => {
  const source = await readFile(from, "utf8");
  let generatedSource = source;

  if (typeof variables === "object") {
    generatedSource = replaceString(source, "%NAME%", variables.name);
  }

  await writeFile(to, generatedSource);
};

const moveWithTemplate = async (from, to, variables) => {
  await copyWithTemplate(from, to, variables);
  // await deleteFile(from);
};

const templateFolder = path.join(__dirname, "template");
const fromPath = (file) => path.join(templateFolder, file);
// const toPath = (file) => path.join(process.cwd(), file);

module.exports = (name) => {
  const pkgName = slugify(name);
  const targetFolder = path.join(process.cwd(), pkgName);

  function toPath(file) {
    return path.join(targetFolder, file);
  }

  const variables = {
    name: pkgName,
  };

  const tasks = new Listr([
    {
      title: "Copy files",
      task: async () => {
        return Promise.all([
          execa("mkdir", ["-p", pkgName]),

          copyWithTemplate(
            fromPath("_package.json"),
            toPath("package.json"),
            variables
          ),

          copyWithTemplate(
            fromPath("README.md"),
            toPath("README.md"),
            variables
          ),

          copyWithTemplate(
            fromPath("_.env.local"),
            toPath(".env.local"),
            variables
          ),

          copyWithTemplate(
            fromPath("_.env.test"),
            toPath(".env.test"),
            variables
          ),

          cpy(
            [
              "_templates",
              ".github",
              ".vscode",
              "chakra",
              "components",
              "context",
              "cypress",
              "graphql",
              "layouts",
              "lib",
              "pages",
              "prisma",
              "public",
              "scripts",
              "services",
              "tests",
              "utils",
              ".eslintrc.js",
              ".gitignore",
              ".hygen.js",
              ".tool-versions",
              "api.graphql",
              "codegen.yml",
              "constants.ts",
              "cypress.json",
              "jest.config.js",
              "next-env.d.ts",
              "prettier.config.js",
              "tsconfig.json",
              "types.ts",
            ],
            targetFolder,
            {
              cwd: templateFolder,
              // preserve path
              parents: true,
            }
          ),
        ]);
      },
    },
    {
      title: "Cleanup...",
      task: async () => {
        return Promise.all([
          copyWithTemplate(
            toPath("prisma/_.env"),
            toPath("prisma/.env"),
            variables
          ),
        ]);
      },
    },
    {
      title: "Install dependencies",
      task: async () => {
        await execa("yarn", ["install"]);
      },
    },
    // {
    //   title: "Add placeholder .env files",
    //   task: () => Promise.resolve(),
    // },
  ]);

  console.log();
  return tasks.run();
};
