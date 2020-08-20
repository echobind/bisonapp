#!/usr/bin/env node
const createBisonApp = require(".");
const inquirer = require("inquirer");
const Logo = require("./logo");

const questions = [
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
];

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
    const answers = await inquirer.prompt(questions);

    createBisonApp({ name, ...answers });
  }
).argv;
