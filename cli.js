#!/usr/bin/env node
const createBisonApp = require(".");

require("yargs").usage(
  "$0 <name>",
  "start the application server",
  function (yargs) {
    yargs.positional("name", {
      describe: "Creates a new Bison app with the specified name",
      type: "string",
    });
  },
  function (yargs) {
    createBisonApp(yargs.name);
  }
).argv;
