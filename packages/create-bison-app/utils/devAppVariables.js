const fs = require("fs");
const path = require("path");

const BISON_DEV_APP_VARIABLES_FILE = "bison.json";

function getDevAppVariables(appPath) {
  return require(path.join(
    appPath,
    BISON_DEV_APP_VARIABLES_FILE
  ));
}

async function saveDevAppVariables(appPath, variables) {
  await fs.promises.writeFile(
    path.join(appPath, BISON_DEV_APP_VARIABLES_FILE),
    JSON.stringify(variables, null, 2)
  );
}

module.exports = {
  getDevAppVariables,
  saveDevAppVariables
};
