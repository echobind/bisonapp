export {};
const spawn = require('child_process').spawn;

// Executes a yarn command in the context of a dotenv file
const args = process.argv.slice(2);
spawn('yarn', args, { stdio: 'inherit' });
