const { promisify } = require("util");
const fs = require("fs");

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
      expect(process.env.DATABASE_NAME).toBe("foo_dev");
    });
  });
});
