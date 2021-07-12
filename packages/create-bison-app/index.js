"use strict";
const fs = require("fs");
const path = require("path");
const slugify = require("slugify");
const execa = require("execa");
const Listr = require("listr");
const nodegit = require("nodegit");
const ejs = require("ejs");
const color = require("chalk");
const {
  BISON_DEV_APP_VARIABLES_FILE,
} = require("./scripts/createDevAppAndStartServer");
const { copyFiles } = require("./tasks/copyFiles");
const { version: bisonVersion } = require("./package.json");

module.exports = async ({ name, ...answers }) => {
  const pkgName = slugify(name);
  const targetFolder = path.join(process.cwd(), pkgName);
  const variables = {
    name: pkgName,
    bisonVersion,
    ...answers,
  };
  const isDevApp = targetFolder.indexOf(__dirname) === 0;

  const tasks = new Listr([
    {
      title: "Copy files",
      task: async () => copyFiles({ variables, targetFolder }),
    },
    {
      title: "Install dependencies",
      task: async () => {
        return execa("yarn", ["install", "-s"], { cwd: pkgName });
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
    {
      title: "Save configuration",
      enabled: () => isDevApp,
      task: async () => {
        // Save variables to file so template directory can be watched
        // and render templates again using same variables
        await fs.promises.writeFile(
          path.join(targetFolder, BISON_DEV_APP_VARIABLES_FILE),
          JSON.stringify(variables, null, 2)
        );
      },
    },
  ]);

  await tasks.run();

  // Show the post install instructions
  const postInstallPath = path.join(__dirname, "postInstallText.ejs");
  const text = await ejs.renderFile(postInstallPath, { ...variables, color });
  console.log(text);
};
