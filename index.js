"use strict";
const { promisify } = require("util");
const path = require("path");
const fs = require("fs");
const replaceString = require("replace-string");
const slugify = require("slugify");
const execa = require("execa");
const Listr = require("listr");
const cpy = require("cpy");
const nodegit = require("nodegit");
const Logo = require("./logo");
const postInstallText = require("./postInstallText");

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const deleteFile = promisify(fs.unlink);
const templateFolder = path.join(__dirname, "template");
const fromPath = (file) => path.join(templateFolder, file);

const TEMPLATE_NAME_TOKEN = "%NAME%";

async function copyWithTemplate(from, to, variables) {
  const source = await readFile(from, "utf8");
  let generatedSource = source;

  if (typeof variables === "object") {
    generatedSource = replaceString(
      source,
      TEMPLATE_NAME_TOKEN,
      variables.name
    );
  }

  await writeFile(to, generatedSource);
}

async function moveWithTemplate(from, to, variables) {
  await copyWithTemplate(from, to, variables);
  await deleteFile(from);
}

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
      title: "Install dependencies",
      task: async () => {
        return execa("yarn", ["install"], { cwd: pkgName });
      },
    },
    {
      title: "Cleanup",
      task: async () => {
        return Promise.all([
          moveWithTemplate(
            toPath("prisma/_.env"),
            toPath("prisma/.env"),
            variables
          ),
        ]);
      },
    },
    {
      title: "Git init",
      task: async () => {
        const repo = await nodegit.Repository.init(targetFolder, 0);
        const index = await repo.refreshIndex();
        await index.addAll(".");
        await index.write();
        const id = await index.writeTree();

        const author = nodegit.Signature.now(
          "Bison Template",
          "hello@echobind.com"
        );

        const committer = nodegit.Signature.now(
          "Bison Template",
          "hello@echobind.com"
        );

        const message = `Initial commit from Bison Template!`;

        // Since we're creating an inital commit, it has no parents. Note that unlike
        // normal we don't get the head either, because there isn't one yet.
        return repo.createCommit("HEAD", author, committer, message, id, []);
      },
    },
  ]);

  console.log(Logo);

  return tasks.run().then(() => {
    const text = replaceString(postInstallText, TEMPLATE_NAME_TOKEN, pkgName);
    console.log(text);
  });
};
