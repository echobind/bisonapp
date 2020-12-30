#!/usr/bin/env node
const createBisonApp = require(".");
const inquirer = require("inquirer");
const Logo = require("./logo");
const execa = require("execa");

const TYPE_MAPPING = {
  input: "string",
  list: "string",
  confirm: "boolean",
};

function convertInquirerTypeToYarnType(type) {
  return TYPE_MAPPING[type] || "string";
}

/**
 * Generates questions for Inquirer based on an app name.
 * @param {string} appName The name of the app
 */
function generateQuestions(appName) {
  return [
    {
      name: "repo.addRemote",
      type: "confirm",
      message:
        "Would you like to add a git origin when complete? (required if using Heroku)",
      default: true,
    },
    {
      name: "githubRepo",
      type: "input",
      message: "Create a new GitHub repo and paste the url here:",
      description: "The GitHub url",
      when: (answers) => answers.repo.addRemote,
    },
    {
      name: "repo.stagingBranch",
      type: "input",
      message:
        "What branch would you like to use for staging deploys? (migrates staging db on build)",
      description: "The Staging Branch Name",
      default: "dev",
      when: (answers) => answers.repo.addRemote,
    },
    {
      name: "repo.productionBranch",
      type: "input",
      message: "What branch would you like to use for production deploys?",
      description: "The Production Branch Name",
      default: "main",
      when: (answers) => answers.repo.addRemote,
    },
    //Prompt user for database type - list - save information to a variable (this is the name of the hash)
    {
      name: "db.dev.databaseType",
      type: "list",
      message: "What type of database would you like to use?",
      description: "The database type",
      choices: [
        { name: "Postgres", value: "postgres" },
        { name: "MySQL", value: "MySQL" },
        { name: "MariaDB", value: "MariaDB" },
        { name: "SQLite", value: "SQLite" },
        { name: "AWS Aurora", value: "AWS Aurora" },
        { name: "AWS Aurora Serverless", value: "AWS Aurora Serverless" }
      ],
      default: "postgres",
    },
    //Ask user if they have it setup? - save information to a variable (this is the name of the hash)
    {
      name: "db.dev.isLocalDBDefined",
      type: "confirm",
      message: "Do you have it setup?",
      description: "Find if user has a database setup",
      default: false
    },
    //If no inform the user of the link will teach them how to add the database (postgres for now)
    {
      name: "db.dev.dbMarkdown",
      type: "input",
      message: "Please use <link goes here> to setup a postgres database with the following credentials.",
      description: "Link to database instructions.",
      when: (answers) => answers.db.dev.isLocalDBDefined == false,
    },
    //Else proceed to current setup
    {
      name: "db.dev.name",
      type: "input",
      message: "What is the local database name?",
      description: "The database to use in development",
      default: `${appName}_dev`,
    },
    {
      //TODO: Save all information and show the user after all prompts are finished that it is the credentials they will use to complete database setup
      name: "db.dev.user",
      type: "input",
      message: "What is the local database username?",
      description: "The database user",
      default: "postgres",
    },
    {
      name: "db.dev.password",
      type: "input",
      message: "What is the local database password?",
      description: "The database password",
      default: "",
    },
    {
      name: "db.dev.host",
      type: "input",
      message: "What is the local database host?",
      description: "The database host",
      default: "localhost",
    },
    {
      name: "db.dev.port",
      type: "input",
      message: "What is the local database port?",
      description: "The database port",
      default: "5432",
    },
    {
      name: "db.test.name",
      type: "input",
      message: "What is the local test database name?",
      description: "The database name used in test env",
      default: `${appName}_test`,
    },
    {
      name: "host.name",
      type: "list",
      message: "Where will you deploy the app?",
      description: "Where you want to deploy the app",
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
      description: "Create apps/pipelines on Heroku",
      default: true,
      when: (answers) =>
        answers.repo.addRemote && answers.host.name === "heroku",
    },
    {
      name: "host.staging.name",
      type: "input",
      message: "Enter the name for the staging app (must be unique)",
      description: "staging app name on Heroku",
      when: ({ host }) => host.name === "heroku" && host.createAppsAndPipelines,
      default: `${appName}-staging`,
    },
    {
      name: "host.staging.db",
      type: "list",
      message: "What database tier do you want on staging?",
      description: "staging database tier on Heroku",
      choices: ["heroku-postgresql:hobby-dev", "heroku-postgresql:standard-0"],
      when: ({ host }) => host.name === "heroku" && host.createAppsAndPipelines,
      default: "heroku-postgresql:hobby-dev",
    },
    {
      name: "host.production.name",
      type: "input",
      message: "Enter the name for the production app (must be unique)",
      description: "prod app name on Heroku",
      when: ({ host }) => host.name === "heroku" && host.createAppsAndPipelines,
      default: `${appName}`,
    },
    {
      name: "host.production.db",
      type: "list",
      message: "What database tier do you want on production?",
      description: "prod database tier on Heroku",
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
  "Creates a new Bison application",
  function (yargs) {
    yargs.positional("name", {
      describe: "Creates a new Bison app with the specified name",
      type: "string",
    });

    const options = generateQuestions();

    options.forEach((option) => {
      yargs.option(option.name, {
        describe: option.description,
        type: convertInquirerTypeToYarnType(option.type),
      });
    });
  },
  async function (yargs) {
    // Show the logo!
    console.log(Logo);

    function parseObjectFromDotNotation2(obj) {
      if (!obj) {
        return {};
      }

      const isPlainObject = (obj) =>
        !!obj && obj.constructor === {}.constructor;

      const getNestedObject = (obj) =>
        Object.entries(obj).reduce((result, [prop, val]) => {
          prop.split(".").reduce((nestedResult, prop, propIndex, propArray) => {
            const lastProp = propIndex === propArray.length - 1;
            if (lastProp) {
              nestedResult[prop] = isPlainObject(val)
                ? getNestedObject(val)
                : val;
            } else {
              nestedResult[prop] = nestedResult[prop] || {};
            }
            return nestedResult[prop];
          }, result);
          return result;
        }, {});

      return getNestedObject(obj);
    }

    async function fetchAnswers(answers = {}) {
      const questions = generateQuestions(name);
      const answerKeys = Object.keys(answers);

      // filter out yargs keys from answers
      const filteredAnswers = answerKeys.reduce((prev, key) => {
        if (key.match(/(_|\$0)/)) {
          return prev;
        }

        prev[key] = answers[key];
        return prev;
      }, Object.create(null));

      // use defaults if acceptDefaults is true
      const shouldUseDefaults = answerKeys.find((k) => k === "acceptDefaults");

      if (shouldUseDefaults) {
        const defaults = questions.reduce((prev, question) => {
          prev[question.name] = question.default;
          return prev;
        }, Object.create(null));

        const parsedDefaults = parseObjectFromDotNotation2(defaults);
        const parsedAnswers = parseObjectFromDotNotation2(filteredAnswers);

        return { ...parsedDefaults, ...parsedAnswers };
      }

      // otherwise, prompt for remaining answers
      return await inquirer.prompt(questions, answers);
    }

    const { name, ...cliAnswers } = yargs;
    const answers = await fetchAnswers(cliAnswers);
    const hostName = answers.host.name;

    if (hostName !== "heroku") {
      return createBisonApp({ name, ...answers });
    }

    // If heroku, make sure they are logged in before continuing.
    try {
      await verifyHerokuLogin();
      return createBisonApp({ name, ...answers });
    } catch {
      console.error(
        `\n\nIt looks like you're not logged in to Heroku CLI. Use \`heroku login\` and try again.`
      );
    }
  }
).argv;
