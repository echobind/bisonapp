#!/usr/bin/env node
const createBisonApp = require(".");
const inquirer = require("inquirer");
const Logo = require("./logo");
const execa = require("execa");

/**
 * Generates questions for Inquirer based on an app name.
 * @param {string} appName The name of the app
 */
function generateQuestions(appName) {
  return [
    {
      name: "githubRepo",
      type: "input",
      message: "Create a new GitHub repo and paste the url here:",
    },
    {
      name: "db.dev.name",
      type: "input",
      message: "What is the local database name?",
      default: `${appName}_dev`,
    },
    {
      name: "db.dev.user",
      type: "input",
      message: "What is the local database username?",
      default: "postgres",
    },
    {
      name: "db.dev.password",
      type: "input",
      message: "What is the local database password?",
      default: "",
    },
    {
      name: "db.dev.host",
      type: "input",
      message: "What is the local database host?",
      default: "localhost",
    },
    {
      name: "db.dev.port",
      type: "input",
      message: "What is the local database port?",
      default: "5432",
    },
    {
      name: "db.test.name",
      type: "input",
      message: "What is the local test database name?",
      default: `${appName}_test`,
    },
    {
      name: "host.name",
      type: "list",
      message: "Where will you deploy the app?",
      choices: [
        { name: "Vercel (recommended)", value: "vercel" },
        { name: "Heroku", value: "heroku" },
      ],
      default: "vercel",
    },
    {
      name: "host.createAppsAndPipelines",
      type: "confirm",
      message: "Do you want to automatically create apps and pipelines?",
      when: (answers) => answers.host.name === "heroku",
      default: true,
    },
    {
      name: "host.staging.name",
      type: "input",
      message: "Enter the name for the staging app (must be unique)",
      when: ({ host }) => host.name === "heroku" && host.createAppsAndPipelines,
      default: `${appName}-staging`,
    },
    {
      name: "host.staging.db",
      type: "list",
      message: "What database tier do you want on staging?",
      choices: ["heroku-postgresql:hobby-dev", "heroku-postgresql:standard-0"],
      when: ({ host }) => host.name === "heroku" && host.createAppsAndPipelines,
      default: "heroku-postgresql:hobby-dev",
    },
    {
      name: "host.production.name",
      type: "input",
      message: "Enter the name for the production app (must be unique)",
      when: ({ host }) => host.name === "heroku" && host.createAppsAndPipelines,
      default: `${appName}`,
    },
    {
      name: "host.production.db",
      type: "list",
      message: "What database tier do you want on production?",
      choices: ["heroku-postgresql:hobby-dev", "heroku-postgresql:standard-0"],
      when: ({ host }) => host.name === "heroku" && host.createAppsAndPipelines,
      default: "heroku-postgresql:standard-0",
    },
  ];
}

/**
 * Verifies a user is logged into the Heroku CLI.
 * If they aren't
 */
async function verifyHerokuLogin() {
  const { stdout } = await execa("heroku", ["whoami"]);
  console.log(`Logged into Heroku as ${stdout}`);
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
    const hostName = answers.host.name;

    if (hostName !== "heroku") createBisonApp({ name, ...answers });

    // If heroku, make sure they are logged in before continuing.
    try {
      await verifyHerokuLogin();
      createBisonApp({ name, ...answers });
    } catch {
      console.error(
        `\n\nIt looks like you're not logged in to Heroku CLI. Use \`heroku login\` and try again.`
      );
    }
  }
).argv;
