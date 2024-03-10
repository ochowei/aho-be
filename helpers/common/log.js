const Bunyan = require('bunyan');
const fs = require('fs');
const shelljs = require('shelljs');
const config = require('../../config');

const exist = (path) => {
  try {
    fs.accessSync(path, fs.F_OK);
    return true;
  } catch (error) {
    return false;
  }
};

const mkdir = (path) => {
  try {
    shelljs.mkdir('-p', path);
    return;
  } catch (error) {
    const logger = console;
    logger.error(error);
  }
};

const logDir = config.log.dir;
if (exist(logDir) === false) {
  mkdir(logDir);
}
function createLogger(name) {
  return new Bunyan({
    name,
    src: true,
    streams: [
      {
        level: 'trace',
        path: `${logDir}/access.log`,
      },
    ],
  });
}
module.exports = createLogger;
