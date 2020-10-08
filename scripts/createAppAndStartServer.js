const { createApp } = require("../scripts/createApp");
const { startServer } = require("../scripts/startServer");
module.exports = {};

async function init() {
  const args = process.argv.slice(2);
  const { appPath, appName } = await createApp(args);
  console.log("what", appPath, appName);

  // set env vars like we do on github actions
  process.env.APP_PATH = appPath;
  process.env.APP_NAME = appName;

  return startServer(appPath);
}

if (require.main === module) {
  init();
}
