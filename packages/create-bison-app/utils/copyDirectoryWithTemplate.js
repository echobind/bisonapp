const fs = require("fs");
const path = require("path");
const globby = require("globby");
const { copyWithTemplate } = require("./copyWithTemplate");

/**
 * Remove any extra prefix or extension from the template filename
 * @param {*} file File path
 */
function cleanTemplateDestPath(file) {
  return file
    .replace(/_\./, ".")
    .replace(/\.ejs$/, "");
}

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
      const toFile = cleanTemplateDestPath(file.replace(from, to));
      return copyWithTemplate(file, toFile, variables);
    })
  );
}

module.exports = {
  cleanTemplateDestPath,
  copyDirectoryWithTemplate,
};
