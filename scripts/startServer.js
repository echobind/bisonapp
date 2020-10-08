const execa = require("execa");

async function init() {
  const args = process.argv.slice(2);
  const [cwd, port] = args;
  return startServer(cwd, port);
}

function startServer(cwd, port = "3001") {
  console.log("my args are ", cwd, port);
  return execa(`yarn next dev --port ${port}`, {
    cwd,
    stdio: "inherit",
    shell: true,
  });
}

init();
