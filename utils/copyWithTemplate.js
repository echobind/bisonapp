const fs = require("fs");
const path = require("path");
const ejs = require("ejs");
const color = require("chalk");

/**
 * Copies a file to a different location, running it through an optional ejs template
 * @param {*} from The source file
 * @param {*} to The path to write
 * @param {*} variables Variables to pass to the template
 */
async function copyWithTemplate(from, to, variables) {
  const generatedSource = await ejs.renderFile(
    from,
    { ...variables, color },
    {
      async: true,
    }
  );

  try {
    await fs.promises.mkdir(path.dirname(to), { recursive: true });
  } catch (e) {
    console.error("error making directory", e);
  }

  return await fs.promises.writeFile(to, generatedSource);
}

module.exports = {
  copyWithTemplate,
};
