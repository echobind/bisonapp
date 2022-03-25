#!/usr/bin/env node
const createBisonApp = require(".");
const inquirer = require("inquirer");
const get = require("lodash/get");
const set = require("lodash/set");
const Logo = require("./logo");

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
      name: "db.dev.name",
      type: "input",
      message: "What is the local database name?",
      description: "The database to use in development",
      default: `${appName}_dev`,
    },
    {
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
  ];
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

    async function fetchAnswers(answers = {}) {
      const questions = generateQuestions(name);

      // Skip prompts and use defaults if acceptDefaults is true
      const shouldUseDefaults = !!answers.acceptDefaults;

      if (shouldUseDefaults) {
        const defaultAnswers = {};

        for (const question of questions) {
          // Get answer from arguments if exists or use default
          const answer = get(answers, question.name, question.default);
          set(defaultAnswers, question.name, answer);
        }

        return defaultAnswers;
      }

      // Otherwise, prompt for remaining answers
      return await inquirer.prompt(questions, answers);
    }

    const { name, ...cliAnswers } = yargs;
    const answers = await fetchAnswers(cliAnswers);

    return createBisonApp({ name, ...answers });
  }
).argv;
