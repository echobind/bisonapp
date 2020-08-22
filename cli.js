#!/usr/bin/env node
const createBisonApp = require(".");
const inquirer = require("inquirer");
const Logo = require("./logo");

function generateQuestions(appName) {
  return [
    {
      name: "host.name",
      type: "list",
      message: "Where will you deploy the app?",
      choices: [
        { name: "Vercel", value: "vercel" },
        { name: "Heroku", value: "heroku" },
      ],
      default: "vercel",
    },
    {
      name: "host.stagingAppName",
      type: "input",
      message: "Enter the name for the staging app (must be unique)",
      when: (answers) => answers.host.name === "heroku",
      default: `${appName}-staging`,
    },
    {
      name: "host.productionAppName",
      type: "input",
      message: "Enter the name for the production app (must be unique)",
      when: (answers) => answers.host.name === "heroku",
      default: `${appName}`,
    },
  ];
}

require("yargs").usage(
  "$0 <name>",
  "start the application server",
  function (yargs) {
    yargs.positional("name", {
      describe: "Creates a new Bison app with the specified name",
      type: "string",
    });
  },
  async function (yargs) {
    // Show the logo!
    console.log(Logo);

    const { name } = yargs;
    const questions = generateQuestions(name);
    const answers = await inquirer.prompt(questions);

    createBisonApp({ name, ...answers });
  }
).argv;
