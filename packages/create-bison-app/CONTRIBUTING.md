# Contributing to create-bison-app

## Getting Started

Run the following commands in the `packages/create-bison-app` directory to start the development server:

1. Run `yarn install` to install dependencies
1. Run `yarn dev` to create a Bison app and start the server. Optionally, you may pass the following arguments and options:
   - `[script]` Any script in the template's [package.json](/packages/create-bison-app/template/package.json.ejs). By default, the `dev` script is run.
   - `--acceptDefaults` Skip interactive prompts and use default options to create a new Bison app
   - `--clean` When running `yarn dev` subsequent times, use this to reconfigure and create a new Bison app

### Example Usages

Start the development server:

```
yarn dev --acceptDefaults --clean
```

Run the `test` script in the template's [package.json](/packages/create-bison-app/template/package.json.ejs):

```
yarn dev test
```

## Making Changes to the Bison Template

After you have the development server running, you can make your changes in the `packages/create-bison-app/template/` directory which will trigger the server to recompile.
