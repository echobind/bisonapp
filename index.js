"use strict";
const { promisify } = require("util");
const path = require("path");
const fs = require("fs");
const slugify = require("slugify");
const execa = require("execa");
const Listr = require("listr");
const cpy = require("cpy");
const nodegit = require("nodegit");
const ejs = require("ejs");
const color = require("chalk");

const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);
const templateFolder = path.join(__dirname, "template");
const fromPath = (file) => path.join(templateFolder, file);

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
    await mkdir(path.dirname(to), { recursive: true });
  } catch (e) {}

  await writeFile(to, generatedSource);
}

module.exports = async ({ name, ...answers }) => {
  const pkgName = slugify(name);
  const targetFolder = path.join(process.cwd(), pkgName);
  const variables = {
    name: pkgName,
    ...answers,
  };

  const isHeroku = answers.host.name === "heroku";

  /**
   * Appends file to the targetFolder path
   * @param {*} file the file path
   */
  function toPath(file) {
    return path.join(targetFolder, file);
  }

  // Files to render when using Heroku
  const herokuFiles = () =>
    !isHeroku
      ? []
      : [copyWithTemplate(fromPath("app.json"), toPath("app.json"), variables)];

  const tasks = new Listr([
    {
      title: "Copy files",
      task: async () => {
        return Promise.all([
          execa("mkdir", ["-p", pkgName]),

          copyWithTemplate(
            fromPath("package.json.ejs"),
            toPath("package.json"),
            variables
          ),

          copyWithTemplate(
            fromPath("README.md.ejs"),
            toPath("README.md"),
            variables
          ),

          copyWithTemplate(
            fromPath("_.env.local.ejs"),
            toPath(".env.local"),
            variables
          ),

          copyWithTemplate(
            fromPath("_.env.test.ejs"),
            toPath(".env.test"),
            variables
          ),

          copyWithTemplate(
            fromPath(".github/workflows/main.js.yml.ejs"),
            toPath(".github/workflows/main.js.yml"),
            variables
          ),

          copyWithTemplate(
            fromPath(".github/PULL_REQUEST_TEMPLATE.md"),
            toPath(".github/PULL_REQUEST_TEMPLATE.md"),
            variables
          ),

          copyWithTemplate(
            fromPath("pages/api/graphql.ts.ejs"),
            toPath("pages/api/graphql.ts"),
            variables
          ),

          copyWithTemplate(
            fromPath("prisma/_.env"),
            toPath("prisma/.env"),
            variables
          ),

          ...herokuFiles(),

          cpy(
            [
              "_templates",
              ".vscode",
              ".github",
              "!.github/workflows/main*",
              "chakra",
              "components",
              "context",
              "cypress",
              "graphql",
              "layouts",
              "lib",
              "pages",
              "!pages/api/graphql*",
              "prisma",
              "!prisma/_.env",
              "public",
              "scripts",
              "services",
              "tests",
              "utils",
              ".eslintrc.js",
              ".gitignore",
              ".hygen.js",
              ".tool-versions",
              "api.graphql",
              "codegen.yml",
              "constants.ts",
              "cypress.json",
              "jest.config.js",
              "next-env.d.ts",
              "prettier.config.js",
              "tsconfig.json",
              "types.ts",
            ],
            targetFolder,
            {
              cwd: templateFolder,
              // preserve path
              parents: true,
            }
          ),
        ]);
      },
    },
    // {
    //   title: "Install dependencies",
    //   task: async () => {
    //     return execa("yarn", ["install"], { cwd: pkgName });
    //   },
    // },
    // {
    //   title: "Generate Prisma client",
    //   task: async () => {
    //     return execa("yarn", ["prisma", "generate"], {
    //       cwd: pkgName,
    //     });
    //   },
    // },
    // {
    //   title: "Generate Nexus types",
    //   task: async () => {
    //     return execa("yarn", ["nexus", "build", "--no-bundle"], {
    //       cwd: pkgName,
    //     });
    //   },
    // },
    // {
    //   title: "Git init",
    //   task: async () => {
    //     const repo = await nodegit.Repository.init(targetFolder, 0);
    //     const index = await repo.refreshIndex();
    //     await index.addAll(".");
    //     await index.write();
    //     const id = await index.writeTree();
    //     await nodegit.Remote.create(repo, "origin", variables.githubRepo);

    //     const author = nodegit.Signature.now(
    //       "Bison Template",
    //       "hello@echobind.com"
    //     );

    //     const committer = nodegit.Signature.now(
    //       "Bison Template",
    //       "hello@echobind.com"
    //     );

    //     const message = `Initial commit from Bison Template!`;

    //     // Since we're creating an inital commit, it has no parents. Note that unlike
    //     // normal we don't get the head either, because there isn't one yet.
    //     return repo.createCommit("HEAD", author, committer, message, id, []);
    //   },
    // },
    // {
    //   title: `Heroku Setup`,
    //   enabled: () => variables.host.name === "heroku",
    //   task: async () => {
    //     const repoName = variables.githubRepo.match(/(\w+\/\w+).git$/)[1];

    //     // create staging app
    //     await execa(
    //       "heroku",
    //       [
    //         "apps:create",
    //         variables.host.staging.name,
    //         "--remote=staging",
    //         `--addons=${variables.host.staging.db}`,
    //       ],
    //       {
    //         cwd: pkgName,
    //       }
    //     );

    //     // create prod app
    //     await execa(
    //       "heroku",
    //       [
    //         "apps:create",
    //         variables.host.production.name,
    //         "--remote=production",
    //         `--addons=${variables.host.production.db}`,
    //       ],
    //       {
    //         cwd: pkgName,
    //       }
    //     );

    //     // create pipeline
    //     await execa(
    //       "heroku",
    //       [
    //         "pipelines:create",
    //         variables.name,
    //         "--remote=staging",
    //         "--stage=staging",
    //       ],
    //       {
    //         cwd: pkgName,
    //       }
    //     );

    //     // add staging app to pipeline
    //     await execa(
    //       "heroku",
    //       [
    //         "pipelines:add",
    //         variables.name,
    //         "--remote=production",
    //         "--stage=production",
    //       ],
    //       {
    //         cwd: pkgName,
    //       }
    //     );

    //     // connect pipeline to github
    //     await execa(
    //       "heroku",
    //       ["pipelines:connect", variables.name, `--repo=${repoName}`],
    //       {
    //         cwd: pkgName,
    //       }
    //     );
    //   },
    // },
  ]);

  await tasks.run();

  // Show the post install instructions
  const postInstallPath = path.join(__dirname, "postInstallText.ejs");
  const text = await ejs.renderFile(postInstallPath, { ...variables, color });
  console.log(text);
};
