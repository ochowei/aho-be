const { Sequelize } = require('sequelize');
const mysql = require('mysql2');
const { promisify } = require('util');

const { debug } = require('../../config').system;
const { setupModels } = require('../../models');

const MYSQL_CONNECTION_POOL_SIZE = 10;
// support type bigInt
const defaultOptions = {
  supportBigNumbers: true,
  bigNumberStrings: true,
  charset: 'utf8mb4',
  connectTimeout: 30000,
  // decimalNumbers: true
  // if process.env.ENV is set,

};

/**
 * mariadb version setup function
 */
// const mariadb = require("mariadb");
// let pools = {};
// const setupMysql = async config => {
//   Object.keys(config).forEach(db => {
//     const pool = mariadb.createPool({
//       ...config[db],
//       connectionLimit: 1,
//       ...defaultOptions
//     });
//     pools[db] = pool;
//     pool.query = async sql => {
//       const conn = await pool.getConnection();
//       const result = await conn.query(sql);
//       return result;
//     };
//   });
// };
const pools = {};
let poolCluster = {};
const setupMysql = async (config) => {
  poolCluster = mysql.createPoolCluster({
    restoreNodeTimeout: 1000,
  });
  Object.keys(config).forEach((db) => {
    poolCluster.add(db, { ...config[db], ...defaultOptions });
    const pool = poolCluster.of(db, 'RANDOM');
    pools[db] = pool;
    pool.query = promisify(pool.query);
    pool.getConnection = promisify(pool.getConnection);
  });
  await pools.master.getConnection();
};
// sequelize
const sequelizePool = {};
let alreadyInit = false;
const initSequelize = async (config) => {
  if (alreadyInit) return;
  alreadyInit = true;
  await setupMysql(config);
  Object.keys(config).forEach((db) => {
    if (process.env.ENV !== 'test' && config[db].host !== '127.0.0.1') {
      defaultOptions.ssl = {
        require: true,
        ca: process.env.MYSQL_CA.replace(/\\n/g, '\n'),
      };
    }
    const conn = new Sequelize(
      config[db].database,
      config[db].user,
      config[db].password,
      {
        host: config[db].host,
        port: config[db].port,
        dialect: 'mysql',
        dialectOptions: Object.assign(defaultOptions, {
          // Your mariadb options here
          // connectTimeout: 1000
          // timezone: "Etc/GMT+0", //for writing to database
        }),
        timezone: '+00:00',
        logging: debug,
        pool: {
          max: MYSQL_CONNECTION_POOL_SIZE,
          min: 0,
          idle: 10000,
          acquire: 30000,
        },
      },
    );
    sequelizePool[db] = conn;
  });
  await setupModels(sequelizePool.master);
};

/**
 * mysql version
 */

// const releaseMysql = async () => {
//   poolCluster.end(error => {
//     if (error) console.log(error);
//   });
// };

module.exports = {
  mysql: pools,
  setupMysql,
  initSequelize,
  sequelizePool,
};
