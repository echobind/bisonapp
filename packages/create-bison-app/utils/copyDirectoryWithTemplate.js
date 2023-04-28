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

  // Glob patterns can only contain forward-slashes (even on Windows)
  const globPattern = `${from.replace(/\\/g, '/')}/**`;
  const files = await globby([globPattern], { expandDirectories: true, dot: true });

  return await Promise.all(
    files.map(async (file) => {
      // Normalize the file path for Windows to ensure back-slashes are used
      const filePath = path.normalize(file);

      const toFile = cleanTemplateDestPath(filePath.replace(from, to));
      return copyWithTemplate(file, toFile, variables);
    })
  );
}

module.exports = {
  cleanTemplateDestPath,
  copyDirectoryWithTemplate,
};
