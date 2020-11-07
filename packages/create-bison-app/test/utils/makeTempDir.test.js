const { makeTempDir } = require("../../utils/makeTempDir");
const fs = require("fs");

describe("makeTempDir", () => {
  it("creates a temp dir", async () => {
    const dir = await makeTempDir();

    expect(() => fs.promises.stat(dir)).not.toThrowError();
  });
});
