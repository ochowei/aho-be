const path = require('path');

const pathBase = path.resolve(__dirname, '..');
const config = {
  env: process.env.ENV || 'development',
  log: {
    dir: path.resolve(pathBase, 'log'),
  },
};

let overrides = {};
overrides = require('./config.json');

Object.assign(config, overrides);

module.exports = Object.freeze(config);
