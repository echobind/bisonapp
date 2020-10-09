const execa = require("execa");

async function init() {
  const args = process.argv.slice(2);
  const [cwd, port] = args;
  return startServer(cwd, port);
}

function startServer(cwd, port = "3001") {
  const { APP_NAME, APP_PATH } = process.env;
  return execa(`yarn next dev --port ${port}`, {
    cwd,
    stdio: "inherit",
    shell: true,
    env: {
      APP_NAME,
      APP_PATH,
    },
  });
}

if (require.main === module) {
  init();
}

module.exports = {
  startServer,
};
