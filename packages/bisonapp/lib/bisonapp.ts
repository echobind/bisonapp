#!/usr/bin/env node
import yargs from "yargs";

// eslint-disable-next-line no-unused-expressions
yargs
  .commandDir("../commands", {
    extensions: ["ts"],
  })
  .scriptName("bison")
  .example(
    "yarn bison g page posts/new",
    '"Create a new page at pages/posts/new"'
  )
  .demandCommand()
  .strict().argv;
