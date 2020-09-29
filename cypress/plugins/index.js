/// <reference types="cypress" />
const { promisify } = require("util");
const os = require("os");
const path = require("path");
const mkdtemp = promisify(require("fs").mkdtemp);
const childProcess = require("child_process");
const execa = require("execa");
const waitOn = require("wait-on");
const psTree = promisify(require("ps-tree"));

// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {

  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  on("task", {});
};
