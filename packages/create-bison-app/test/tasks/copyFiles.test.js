const fs = require("fs");
const path = require("path");

const { makeTempDir } = require("../../utils/makeTempDir");
const { copyFiles } = require("../../tasks/copyFiles");
const { version: bisonVersion } = require("../../package.json");

const DEFAULT_VARS = {
  host: {
    name: "vercel",
  },
  db: {
    dev: {
      name: "devdb",
      host: "localhost",
      user: "postgres",
      password: "",
      port: 5432,
    },
    test: {
      name: "testdb",
    },
  },
  bisonVersion,
};

describe("copyFiles", () => {
  describe("defaults", () => {
    let targetFolder, variables;

    beforeAll(async () => {
      variables = {
        name: "MyCoolApp",
        ...DEFAULT_VARS,
      };

      const temp = await makeTempDir();
      targetFolder = path.join(temp, variables.name);
      await copyFiles({ variables, targetFolder });
    });

    it("creates a directory for variables.name", async () => {
      expect(() => fs.statSync(targetFolder)).not.toThrowError();
    });

    it("does not create app.json", async () => {
      const target = path.join(targetFolder, "app.json");
      expect(() => fs.statSync(target)).toThrowError();
    });

    it("copies and renames .gitignore", async () => {
      const target = path.join(targetFolder, ".gitignore");
      expect(() => fs.statSync(target)).not.toThrowError();
    });

    it("copies and renames .env.local and env.test", async () => {
      const files = [".env.local", ".env.test"];

      files.forEach((file) => {
        const filePath = path.join(targetFolder, file);

        expect(() => fs.statSync(filePath)).not.toThrowError();
      });
    });

    it("copies and renames .github", async () => {
      const files = ["workflows/main.js.yml", "PULL_REQUEST_TEMPLATE.md"];

      files.forEach((file) => {
        const filePath = path.join(targetFolder, ".github", file);

        expect(() => fs.statSync(filePath)).not.toThrowError();
      });
    });

    it("copies and renames other files in root", async () => {
      const files = [
        ".eslintrc.js",
        ".hygen.js",
        ".tool-versions",
        "codegen.yml",
        "constants.ts",
        "cypress.json",
        "jest.config.js",
        "next-env.d.ts",
        "prettier.config.js",
        "README.md",
        "tsconfig.json",
      ];

      files.forEach((file) => {
        const filePath = path.join(targetFolder, file);

        expect(() => fs.statSync(filePath)).not.toThrowError();
      });
    });

    it("copies package.json with the expected content", async () => {
      const filePath = path.join(targetFolder, "package.json");
      const contents = require(filePath);
      const { bison: bisonConfig } = contents;

      expect(bisonConfig.version).toBe(bisonVersion);
    });

    it("copies pages", async () => {
      const files = [
        "api/graphql.ts",
        "_app.tsx",
        "index.tsx",
        "login.tsx",
        "signup.tsx",
      ];

      files.forEach((file) => {
        const filePath = path.join(targetFolder, "pages", file);

        expect(() => fs.statSync(filePath)).not.toThrowError();
      });
    });

    it("copies the prisma folder", async () => {
      const files = ["migrations", "schema.prisma", "seed.ts"];

      files.forEach((file) => {
        const filePath = path.join(targetFolder, "prisma", file);

        expect(() => fs.statSync(filePath)).not.toThrowError();
      });
    });

    it("copies env with the correct contents", async () => {
      const target = path.join(targetFolder, ".env");
      const file = await fs.promises.readFile(target);
      const fileString = file.toString();
      const { user, password, host, port, name } = variables.db.dev;

      const databaseUrl = `postgresql://${user}${password}@${host}:${port}`;

      expect(fileString).toContain(databaseUrl);
      expect(fileString).toContain(name);
    });

    it("copies graphql", async () => {
      const files = [
        "schema.ts",
        "context.ts",
        "modules/index.ts",
        "modules/user.ts",
        "modules/scalars.ts",
      ];

      files.forEach((file) => {
        const filePath = path.join(targetFolder, "graphql", file);

        expect(() => fs.statSync(filePath)).not.toThrowError();
      });
    });

    it("copies e2e tests", async () => {
      const files = [".eslintrc.json", "login.test.js"];

      files.forEach((file) => {
        const filePath = path.join(targetFolder, "tests", "e2e", file);

        expect(() => fs.statSync(filePath)).not.toThrowError();
      });
    });

    it("copies factories", async () => {
      const files = ["user.ts", "index.ts"];

      files.forEach((file) => {
        const filePath = path.join(targetFolder, "tests", "factories", file);

        expect(() => fs.statSync(filePath)).not.toThrowError();
      });
    });

    it("copies request tests", async () => {
      const files = [
        "createUser.test.ts",
        "login.test.ts",
        "me.test.ts",
        "signup.test.ts",
        "users.test.ts",
      ];

      files.forEach((file) => {
        const filePath = path.join(
          targetFolder,
          "tests",
          "requests",
          "user",
          file
        );

        expect(() => fs.statSync(filePath)).not.toThrowError();
      });
    });

    it("copies unit tests", async () => {
      const files = [
        "utils/.gitkeep",
        "components/CenteredBoxForm.test.tsx",
        "components/ErrorText.test.tsx",
        "components/LoginForm.test.tsx",
        "components/Logo.test.tsx",
        "components/Nav.test.tsx",
        "components/SignupForm.test.tsx",
      ];

      files.forEach((file) => {
        const filePath = path.join(targetFolder, "tests", "unit", file);

        expect(() => fs.statSync(filePath)).not.toThrowError();
      });
    });

    it("copies test utils", async () => {
      const files = [
        "helpers.ts",
        "jest.setup.js",
        "jest.teardown.js",
        "matchMedia.mock.js",
        "utils.tsx",
      ];

      files.forEach((file) => {
        const filePath = path.join(targetFolder, "tests", file);

        expect(() => fs.statSync(filePath)).not.toThrowError();
      });
    });

    it("copies template folder, but keeps ejs files", async () => {
      const files = [
        "cell/new/new.ejs",
        "component/new/new.ejs",
        "graphql/new/graphql.ejs",
        "graphql/new/injectImport.ejs",
        "page/new/new.ejs",
        "test/component/component.ejs",
        "test/factory/factory.ejs",
        "test/request/request.ejs",
      ];

      files.forEach((file) => {
        const filePath = path.join(targetFolder, "_templates", file);

        expect(() => fs.statSync(filePath)).not.toThrowError();
      });
    });
  });

  describe("Heroku", () => {
    let targetFolder;

    beforeAll(async () => {
      let herokuVars = {
        name: "MyCoolApp",
        ...DEFAULT_VARS,
      };

      herokuVars.host.name = "heroku";

      const temp = await makeTempDir();
      targetFolder = path.join(temp, herokuVars.name);
      await copyFiles({ variables: herokuVars, targetFolder });
    });

    it("creates app.json", async () => {
      const target = path.join(targetFolder, "app.json");
      expect(() => fs.statSync(target)).not.toThrowError();
    });
  });
});
