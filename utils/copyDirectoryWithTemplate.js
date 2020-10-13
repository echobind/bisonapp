const fs = require("fs");
const path = require("path");
const globby = require("globby");
const { copyWithTemplate } = require("./copyWithTemplate");

/**
 * Copies a file to a different location, running it through an optional ejs template
 * @param {*} from The source file
 * @param {*} to The path to write
 * @param {*} variables Variables to pass to the template
 */
async function copyDirectoryWithTemplate(from, to, variables) {
  try {
    await fs.promises.mkdir(path.dirname(to), { recursive: true });
  } catch (e) {
    console.error("error making directory", e);
  }

  const files = await globby([`${from}/**`], { expandDirectories: true });

  return await Promise.all(
    files.map(async (file) => {
      const toFile = file
        .replace(from, to)
        .replace(/_\./, ".")
        .replace(/\.ejs$/, "");

      return copyWithTemplate(file, toFile, variables);
    })
  );
}

module.exports = {
  copyDirectoryWithTemplate,
};
