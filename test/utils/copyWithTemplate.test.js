const { tmpdir } = require("os");
const path = require("path");
const fs = require("fs");
const { copyWithTemplate } = require("../../utils/copyWithTemplate");
const { makeTempDir } = require("../../utils/makeTempDir");

describe("copyWithTemplate", () => {
  it("parses an ejs file", async () => {
    const variables = {
      host: {
        name: "heroku",
      },
    };

    const tmpDir = await makeTempDir();
    const newPath = path.join(tmpDir, "parsed.ts");
    const fromPath = path.join(__dirname, "../fixtures/hostName.ts.ejs");

    await copyWithTemplate(fromPath, newPath, variables);

    const file = await fs.promises.readFile(newPath);
    const fileString = file.toString();

    expect(fileString).toContain("heroku");
  });

  it("parses an ejs file", async () => {
    const variables = {
      host: {
        name: "vercel",
      },
    };

    const tmpDir = await makeTempDir();
    const newPath = path.join(tmpDir, "parsed.ts");
    const fromPath = path.join(__dirname, "../fixtures/hostName.ts.ejs");

    await copyWithTemplate(fromPath, newPath, variables);

    const file = await fs.promises.readFile(newPath);
    const fileString = file.toString();

    expect(fileString).toContain("vercel");
  });
});
