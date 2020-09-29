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
function objectToCliOptions(obj) {
  return Object.keys(options).reduce((prev, key) => {
    prev.push(`--${key}=${options[key]}`);
    return prev;
  }, []);
}

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {
  let server;
  let serverStopped = true;

  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  on("task", {
    createBisonApp: async ({ name, ...options }) => {
      const tmpdir = await mkdtemp(`${os.tmpdir()}${path.sep}`);
      const cliPath = path.join(__dirname, "..", "..", "cli.js");
      const optionKeys = Object.keys(options);

      const cliOptions = optionKeys.length
        ? objectToCliOptions(options)
        : ["--acceptDefaults"];

      console.log("cli options are", cliOptions);
      console.log("cli path", cliPath);
      console.log("installing to:", tmpdir);
      console.log("nodeargs", [cliPath, name, ...cliOptions]);

      await execa("node", [cliPath, name, ...cliOptions], {
        cwd: tmpdir,
        stdio: "inherit",
      });

      return path.join(tmpdir, name);
    },

    startServer: async ({ appDir }) => {
      const url = `http://localhost:3001`;

      server = execa(`yarn next dev --port 3001`, {
        cwd: appDir,
        stdio: "inherit",
        timeout: 10000,
      });

      console.log("whoooooa");

      const options = {
        resources: Array.isArray(url) ? url : [url],
        interval: 2000,
        window: 1000,
        timeout: 5 * 60 * 1000,
        strictSSL: false,
      };

      console.log("ready");
      await waitOn(options);
      serverStopped = false;
      console.log("we good");

      return null;
    },

    // function taken from https://github.com/bahmutov/start-server-and-test/blob/master/src/index.js#L39-L102
    stopServer: () => {
      if (!serverStopped) {
        console.log("ready to stop", server.pid);
        serverStopped = true;
        return psTree(server.pid)
          .then((children) => {
            console.log("children", children);
            children.forEach((child) => {
              try {
                process.kill(child.PID, "SIGINT");
              } catch (e) {
                if (e.code === "ESRCH") {
                  console.log(
                    `Child process ${child.PID} exited before trying to stop it`
                  );
                } else {
                  throw e;
                }
              }
            });
            console.log("we got here?");
            return null;
          })
          .then(() => {
            console.log("we got here 2?");
            console.log(server);
            server.kill();
            server = null;
            return null;
          });
      }
    },
  });
};
