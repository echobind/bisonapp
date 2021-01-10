import yargslib from "yargs";
import { handler as buildNexus } from "./nexus";
import { handler as buildPrisma } from "./prisma";
import { handler as buildNext } from "./next";

export const command = "$0";
export const alias = "all";
export const description = "Builds Nexus Schema, Prisma Client, & Next";

export const builder = (_yargs: yargslib.Argv<{}>) => {};

export const handler = async () => {
  await buildNexus();
  await buildPrisma();
  await buildNext();
};
