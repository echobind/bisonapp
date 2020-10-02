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
    it("correctly defines a DATABASE_URL env var", () => {
      expect(process.env.DATABASE_URL).toBe(
        "postgresql://postgres@localhost:5432/foo_dev?schema=public"
      );
    });
  });
});
