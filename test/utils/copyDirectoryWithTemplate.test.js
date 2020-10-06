const fs = require("fs");
const path = require("path");

const {
  copyDirectoryWithTemplate,
} = require("../../utils/copyDirectoryWithTemplate");

const { makeTempDir } = require("../../utils/makeTempDir");

describe("copyDirectoryWithTemplate", () => {
  it("works", async () => {
    const variables = {
      host: {
        name: "heroku",
      },
    };

    const tmpDir = await makeTempDir();
    const newPath = path.join(tmpDir, "ejsDirectory");
    const fromPath = path.join(__dirname, "../fixtures/ejsDirectory");

    await copyDirectoryWithTemplate(fromPath, newPath, variables);

    const yml = await fs.promises.readFile(path.join(newPath, "config.yml"));
    const ymlString = yml.toString();
    const hostName = await fs.promises.readFile(
      path.join(newPath, "hostName.ts")
    );
    const hostNameString = hostName.toString();

    expect(ymlString).toContain("host: heroku");
    expect(hostNameString).toContain("heroku");
  });
});
