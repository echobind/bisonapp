"use strict";
const fs = require("fs");
const path = require("path");
const slugify = require("slugify");
const execa = require("execa");
const git = require('isomorphic-git');
const globby = require('globby');
const Listr = require("listr");
const ejs = require("ejs");
const color = require("chalk");
const { copyFiles } = require("./tasks/copyFiles");
const { saveDevAppVariables } = require("./utils/devAppVariables");
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
        const gitOptions = { dir: targetFolder, fs };
        await git.init(gitOptions);

        const paths = await globby(
          [
            `./${pkgName}/**`,
            `!./${pkgName}/.git/**`
          ],
          {
            dot: true,
            gitignore: true,
          }
        );
        for (const filepath of paths) {
          await git.add({
            ...gitOptions,
            filepath: filepath.replace(`./${pkgName}/`, ''),
          });
        }

        if (variables.githubRepo) {
          await git.addRemote({
            ...gitOptions,
            remote: 'origin',
            url: variables.githubRepo
          });
        }

        return await git.commit({
          ...gitOptions,
          message: 'Initial commit from Bison Template!',
          author: {
            name: 'Bison Template',
            email: 'hi@echobind.com'
          }
        })
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
    {
      title: "Save configuration",
      enabled: () => isDevApp,
      task: async () => {
        // Save variables to file so template directory can be watched
        // and render templates again using same variables
        await saveDevAppVariables(targetFolder, variables);
      },
    },
  ]);

  await tasks.run();

  // Show the post install instructions
  const postInstallPath = path.join(__dirname, "postInstallText.ejs");
  const text = await ejs.renderFile(postInstallPath, { ...variables, color });
  console.log(text);
};
