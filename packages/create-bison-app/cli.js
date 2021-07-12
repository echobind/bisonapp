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
      name: "repo.productionBranch",
      type: "input",
      message: "What branch would you like to use for production deploys?",
      description: "The Production Branch Name",
      default: "main",
    },
    {
      name: "repo.stagingBranch",
      type: "input",
      message: "What branch would you like to use for staging deploys?",
      description: "The Staging Branch Name",
      default: "dev",
    },
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

    return createBisonApp({ name, ...answers });
  }
).argv;
