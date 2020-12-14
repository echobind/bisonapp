import yargslib from "yargs";
import path from "path";
import execa from "execa";
import { DEFAULT_EXECA_ARGS } from "lib/helpers";

const envPath = path.resolve(process.cwd(), ".env.test");

export const command = "$0";
export const alias = "unit";
export const description = "Runs unit tests";

export interface UnitTestArgs {
  watch?: boolean;
  coverage?: boolean;
  updateSnapshot?: boolean;
}

export const builder = (yargs: yargslib.Argv<UnitTestArgs>) => {
  yargs
    .option("watch", {
      default: false,
      description: "Watch for changes",
      type: "boolean",
    })
    .option("coverage", {
      default: false,
      description: "pass coverage to Jest",
      type: "boolean",
    })
    .option("updateSnapshot", {
      default: false,
      description: "update snapshots",
      type: "boolean",
      alias: "u",
    });
};

export const handler = async ({
  watch = false,
  coverage = false,
  updateSnapshot = false,
}: UnitTestArgs) => {
  require("dotenv").config({ path: envPath });

  let args = ["--runInBand"];
  if (watch) args.push("--watch");
  if (coverage) args.push("--coverage");
  if (updateSnapshot) args.push("--updateSnapshot");

  // use execa directly due to watch mode
  await execa("yarn jest", args, DEFAULT_EXECA_ARGS);
};
