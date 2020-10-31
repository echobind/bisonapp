import yargslib from "yargs";
import path from "path";
import { runCLICommands } from "../../lib/helpers";

const envPath = path.resolve(process.cwd(), ".env.test");

export const command = "e2e";
export const description = "Runs e2e tests using Cypress";

export interface E2EArgs {
  local: boolean;
}

export const builder = (yargs: yargslib.Argv<E2EArgs>) => {
  yargs.option("local", {
    default: false,
    description:
      "Runs against the local dev server instead of spawning a test server",
    type: "boolean",
  });
};

export const handler = async ({ local = false }: E2EArgs) => {
  console.log("using env:", envPath);
  require("dotenv").config({ path: envPath });

  if (local) {
    await runCLICommands([
      {
        title: "Running e2e tests (local server)",
        cmd:
          "CYPRESS_LOCAL=true CYPRESS_BASE_URL=http://localhost:3000 cypress",
        args: ["open"],
      },
    ]);

    return;
  }

  await runCLICommands([
    {
      title: "Running e2e tests",
      cmd: "$(yarn bin)/start-server-and-test",
      args: [
        "'PORT=3001 yarn start'",
        "http://localhost:3001",
        "'yarn cypress run'",
      ],
    },
  ]);
};
