const { promisify } = require("util");
const fs = require("fs");
var assert = require("assert");

async function getTmpDir() {
  const readFile = promisify(fs.readFile);

  const tmpDir = await readFile("./tmp/tmpDir");

  return tmpDir;
}

beforeEach(async () => {
  const path = await getTmpDir();

  require("dotenv").config({
    path: `${path}/foo/prisma/.env`,
  });
});

describe("Prisma", () => {
  describe("Environment Variables", () => {
    it("defines a DATABASE_NAME env var", () => {
      assert.strictEqual(process.env.DATABASE_NAME, "foo_dev");
    });
  });
});
