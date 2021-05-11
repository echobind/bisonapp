"use strict";
const path = require("path");
const slugify = require("slugify");
const execa = require("execa");
const Listr = require("listr");
const nodegit = require("nodegit");
const ejs = require("ejs");
const color = require("chalk");
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

        if (variables.githubRepo) {
          await nodegit.Remote.create(repo, "origin", variables.githubRepo);
        }

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
      title: `Heroku Setup`,
      enabled: () =>
        variables.host.name === "heroku" &&
        variables.host.createAppsAndPipelines,
      task: async () => {
        const repoName = variables.githubRepo.match(/(\w+\/\w+).git$/)[1];
        // ! Bug w/ Pipelines, better error handling needed.
        // await fsPromises.writeFile("Procfile", "web: yarn db:deploy && yarn start");

        // create staging app
        await execa(
          "heroku",
          [
            "apps:create",
            variables.host.staging.name,
            "--remote=staging",
            `--addons=${variables.host.staging.db}`,
          ],
          {
            cwd: pkgName,
          }
        );

        // create prod app
        await execa(
          "heroku",
          [
            "apps:create",
            variables.host.production.name,
            "--remote=production",
            `--addons=${variables.host.production.db}`,
          ],
          {
            cwd: pkgName,
          }
        );

        // create pipeline
        await execa(
          "heroku",
          [
            "pipelines:create",
            variables.name,
            "--remote=staging",
            "--stage=staging",
          ],
          {
            cwd: pkgName,
          }
        );

        // add staging app to pipeline
        await execa(
          "heroku",
          [
            "pipelines:add",
            variables.name,
            "--remote=production",
            "--stage=production",
          ],
          {
            cwd: pkgName,
          }
        );

        // connect pipeline to github
        await execa(
          "heroku",
          ["pipelines:connect", variables.name, `--repo=${repoName}`],
          {
            cwd: pkgName,
          }
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
