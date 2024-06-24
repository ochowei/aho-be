const config = require('../config');
const {
  setupMysql,
  initSequelize,
  sequelizePool,
} = require('../connections/mysql');
require('dotenv').config();
// Load the .env variables
const logger = console;
const mysqlConfig = {
  master: {
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    // ca: process.env.MYSQL_CA.replace(/\\n/g, '\n'),
  },
};
// global set up before all test
exports.mochaGlobalSetup = async () => {
  logger.log('********* Unit Test Start *********');
  logger.log(`[ENV]: ${process.env.ENV}`);
  await initSequelize(config.mysql);

  process.on('unhandledRejection', (err) => {
    logger.log(err);
    throw err;
  });
  const syncDB = async () => {
    await sequelizePool.master
      .sync({ force: true })
      .then(() => logger.log('create master table'));
  };

  await Promise.all([
    // a new function
    syncDB(),
  ]);
  await Promise.all([
    setupMysql(config.mysql).then(() => {
      logger.log('[MYSQL] connect to mysql successful');
    }),
  ]);
};
