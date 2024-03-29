const path = require('path');
const cpy = require('cpy');
const fs = require('fs');

const { copyWithTemplate } = require('../utils/copyWithTemplate');
const { copyDirectoryWithTemplate } = require('../utils/copyDirectoryWithTemplate');

const templateFolder = path.join(__dirname, '..', 'template');
const fromPath = (file) => path.join(templateFolder, file);
const fromSrcPath = (file) => path.join(templateFolder, 'src', file);

/**
 * Copies files based on variables and a target folder
 */
async function copyFiles({ variables, targetFolder }) {
  const toPath = (file) => path.join(targetFolder, file);
  const toSrcPath = (file) => path.join(targetFolder, 'src', file);

  // Files to render when using Heroku
  const isHeroku = variables.host.name === 'heroku';
  let herokuFiles = [];

  if (isHeroku) {
    herokuFiles = [
      copyWithTemplate(fromPath('app.json'), toPath('app.json'), variables),
      copyWithTemplate(fromPath('Procfile'), toPath('Procfile'), variables),
    ];
  }

  return Promise.all([
    fs.promises.mkdir(targetFolder),

    copyWithTemplate(fromPath('package.json.ejs'), toPath('package.json'), variables),

    copyWithTemplate(fromPath('README.md.ejs'), toPath('README.md'), variables),
    copyWithTemplate(fromPath('_.gitignore'), toPath('.gitignore'), variables),

    copyWithTemplate(fromPath('_.env.ejs'), toPath('.env'), variables),

    copyWithTemplate(fromPath('_.env.development.ejs'), toPath('.env.development'), variables),

    copyWithTemplate(
      fromPath('_.env.development.local.ejs'),
      toPath('.env.development.local'),
      variables
    ),

    copyWithTemplate(fromPath('_.env.test.ejs'), toPath('.env.test'), variables),

    copyWithTemplate(fromPath('_.env.test.local.ejs'), toPath('.env.test.local'), variables),

    copyWithTemplate(fromPath('docker-compose.yml.ejs'), toPath('docker-compose.yml'), variables),

    copyDirectoryWithTemplate(fromPath('.github'), toPath('.github'), variables),

    copyDirectoryWithTemplate(fromSrcPath('pages'), toSrcPath('pages'), variables),
    copyDirectoryWithTemplate(fromPath('prisma'), toPath('prisma'), variables),

    copyDirectoryWithTemplate(fromSrcPath('server'), toSrcPath('server'), variables),

    copyDirectoryWithTemplate(fromPath('tests'), toPath('tests'), variables),

    ...herokuFiles,

    cpy(
      [
        '__mocks__',
        '_templates',
        '.vscode',
        'prisma',
        'public',
        'scripts',
        '.eslintrc.js',
        '.hygen.js',
        '.nvmrc',
        '.tool-versions',
        'jest.config.js',
        'playwright.config.ts',
        'next-env.d.ts',
        'prettier.config.js',
        'tsconfig.json',
        'tsconfig.cjs.json',
        'tailwind.config.js',
        'postcss.config.js',
      ],
      targetFolder,
      {
        cwd: templateFolder,
        dot: true,
        // preserve path
        parents: true,
      }
    ),

    cpy(
      [
        'components',
        'context',
        'hooks',
        'layouts',
        'lib',
        'services',
        'styles',
        'types',
        'utils',
        'config.ts',
        'constants.ts',
      ],
      path.join(targetFolder, 'src'),
      {
        cwd: path.join(templateFolder, 'src'),
        dot: true,
        // preserve path
        parents: true,
      }
    ),
  ]);
}

module.exports = {
  copyFiles,
  templateFolder,
};
