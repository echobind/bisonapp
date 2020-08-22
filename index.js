"use strict";
const { promisify } = require("util");
const path = require("path");
const fs = require("fs");
const slugify = require("slugify");
const execa = require("execa");
const Listr = require("listr");
const cpy = require("cpy");
const nodegit = require("nodegit");
const ejs = require("ejs");

const writeFile = promisify(fs.writeFile);
const deleteFile = promisify(fs.unlink);
const templateFolder = path.join(__dirname, "template");
const fromPath = (file) => path.join(templateFolder, file);

async function copyWithTemplate(from, to, variables) {
  // const generatedSource = await renderFile(from, variables);
  const generatedSource = await ejs.renderFile(from, variables, {
    async: true,
  });

  await writeFile(to, generatedSource);
}

async function moveWithTemplate(from, to, variables) {
  await copyWithTemplate(from, to, variables);
  await deleteFile(from);
}

module.exports = async ({ name, ...answers }) => {
  const pkgName = slugify(name);
  const targetFolder = path.join(process.cwd(), pkgName);

  function toPath(file) {
    return path.join(targetFolder, file);
  }

  const variables = {
    name: pkgName,
    ...answers,
  };

  const tasks = new Listr([
    {
      title: "Copy files",
      task: async () => {
        return Promise.all([
          execa("mkdir", ["-p", pkgName]),

          copyWithTemplate(
            fromPath("package.json.ejs"),
            toPath("package.json"),
            variables
          ),

          copyWithTemplate(
            fromPath("README.md.ejs"),
            toPath("README.md"),
            variables
          ),

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

          copyWithTemplate(
            fromPath(".github/workflows/main.js.yml.ejs"),
            toPath(".github/workflows/main.js.yml"),
            variables
          ),

          copyWithTemplate(
            fromPath(".github/PULL_REQUEST_TEMPLATE.md"),
            toPath(".github/PULL_REQUEST_TEMPLATE.md"),
            variables
          ),

          cpy(
            [
              "_templates",
              // ".github",
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
      title: "Generate Prisma client",
      task: async () => {
        return execa("yarn", ["prisma", "generate"], {
          cwd: pkgName,
        });
      },
    },
    {
      title: "Generate Nexus types",
      task: async () => {
        return execa("yarn", ["nexus", "build", "--no-bundle"], {
          cwd: pkgName,
        });
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

  await tasks.run();

  // Show the post install instructions
  const postInstallPath = path.join(__dirname, "postInstallText.ejs");
  const text = await ejs.renderFile(postInstallPath, variables);
  console.log(text);
};
