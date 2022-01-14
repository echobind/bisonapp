import { Command } from 'commander';
import { spawn } from 'child_process';

const program = new Command();
const run = () => {
  program.option('-f, --file <type>', 'filename of script to run');

  program.parse(process.argv);

  const { file } = program.opts();
  console.log({ file });

  const child = spawn(`yarn ts-node ${__dirname}/${file}`, {
    shell: true,
    stdio: 'inherit',
  });

  child.on('exit', function (code) {
    process.exit(code || 1);
  });
};

run();
