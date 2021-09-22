export {};
const spawn = require('child_process').spawn;

// Executes a yarn command in the context of a dotenv file
const args = process.argv.slice(2);
const child = spawn('yarn', args, { stdio: 'inherit' });

child.on('exit', function (code: number) {
  process.exit(code);
});
