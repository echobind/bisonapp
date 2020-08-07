const inflection = require('inflection');
const path = require('path');

const camelizePath = (name, lower = false) => inflection.camelize(name, lower).replace(/::/g, '/');

module.exports = {
  helpers: {
    camelizedPathName: (name, lower = false) => camelizePath(name, lower),
    camelizedBaseName: (name, lower = false) => path.parse(camelizePath(name, lower)).base,
    baseName: (name) => path.parse(name).base,
    dirName: (name) => path.parse(name).dir,
  },
};
