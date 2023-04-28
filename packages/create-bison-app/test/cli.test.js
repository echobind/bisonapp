describe('cli', () => {
  let createBisonApp;
  let originalArgv;

  beforeEach(() => {
    // Remove cached modules. This is needed to run the ../cli.js script
    // multiple times with different arguments.
    jest.resetModules();

    jest.mock('..');
    createBisonApp = require('..');

    // Each test overwrites process arguments so store the original arguments
    originalArgv = process.argv;
  });

  afterEach(() => {
    jest.resetAllMocks();
    process.argv = originalArgv;
  });

  it('should create app with default configuration', async () => {
    await runCreateBisonAppCommand('appName1', '--acceptDefaults');

    expect(createBisonApp).toHaveBeenCalledTimes(1);
    expect(createBisonApp.mock.calls[0][0]).toMatchInlineSnapshot(`
      {
        "db": {
          "dev": {
            "host": "localhost",
            "name": "appName1_dev",
            "password": "",
            "port": "5432",
            "user": "postgres",
          },
          "test": {
            "name": "appName1_test",
          },
        },
        "host": {
          "name": "vercel",
        },
        "name": "appName1",
      }
    `);
  });

  it('should create app with default configuration and override with any arguments', async () => {
    await runCreateBisonAppCommand('appName2', '--acceptDefaults', '--db.dev.name=custom');

    expect(createBisonApp).toHaveBeenCalledTimes(1);
    expect(createBisonApp.mock.calls[0][0]).toMatchInlineSnapshot(`
      {
        "db": {
          "dev": {
            "host": "localhost",
            "name": "custom",
            "password": "",
            "port": "5432",
            "user": "postgres",
          },
          "test": {
            "name": "appName2_test",
          },
        },
        "host": {
          "name": "vercel",
        },
        "name": "appName2",
      }
    `);
  });
});

/**
 * Programmatically set positional and option arguments and execute CLI script
 *
 * @param {string} appName Name of bison app
 * @param  {...string} options Any option arguments allowed by the CLI
 */
async function runCreateBisonAppCommand(appName, ...options) {
  process.argv = [
    'node', // Not used but required at this index in the array
    '../cli.js', // Not used but required at this index in the array
    appName, // App name positional argument
    ...options, // Any option arguments
  ];

  return require('../cli');
}
