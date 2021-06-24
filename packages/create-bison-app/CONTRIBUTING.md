# Contributing to create-bison-app

## Getting Started

Run the following commands in the `packages/create-bison-app` directory to start the development server:

1. Run `yarn install` to install dependencies
1. Run `yarn dev` to create a Bison app and start the server. Optionally, you may pass the following arguments:
   - `--acceptDefaults` Skip interactive prompts and use default options to create a new Bison app
   - `--clean` When running `yarn dev` subsequent times, use this to reconfigure and create a new Bison app
   - `--port` Specify the port to listen on. Defaults to 3001.

Example:
```
yarn dev --acceptDefaults --clean --port=5000
```

## Making Changes to the Bison Template

After you have the development server running, you can make your changes in the `packages/create-bison-app/template/` directory which will trigger the server to recompile.