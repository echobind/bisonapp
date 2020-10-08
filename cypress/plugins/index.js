const fs = require("fs");
const path = require("path");
/// <reference types="cypress" />

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
  on("task", {
    // reads contents of a file based on relative path
    async readProjectFile(filePath) {
      const fullPath = path.join(process.env.APP_PATH, filePath);
      const file = await fs.promises.readFile(fullPath);
      return file.toString();
    },
    // reads app name from ENV
    getAppName() {
      console.log("what", process.env);
      return process.env.APP_NAME;
    },
  });
};
