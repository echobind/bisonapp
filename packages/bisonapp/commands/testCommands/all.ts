import yargslib from "yargs";
import { handler as unitTestHandler, UnitTestArgs } from "./unit";
import { handler as e2eTestHandler, E2EArgs } from "./e2e";

export const command = "all";
export const description = "Runs all tests in the project";

export type TestArgs = E2EArgs & UnitTestArgs;

export const builder = (_yargs: yargslib.Argv<TestArgs>) => {};

export const handler = async ({ local, ...unitArgs }: TestArgs) => {
  await unitTestHandler(unitArgs);
  await e2eTestHandler({ local });
};
