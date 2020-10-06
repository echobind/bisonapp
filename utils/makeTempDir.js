const fs = require("fs");
const os = require("os");
const path = require("path");

/**
 * Makes a generic temporary directory.
 */
async function makeTempDir() {
  return await fs.promises.mkdtemp(`${os.tmpdir()}${path.sep}`);
}

module.exports = {
  makeTempDir,
};
