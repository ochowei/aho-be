const { Sequelize } = require("sequelize");
const debug = require("../../config").system.debug;

// support type bigInt
const defaultOptions = {
  supportBigNumbers: true,
  bigNumberStrings: true,
  charset: "utf8mb4",
  connectTimeout: 30000
  // decimalNumbers: true
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

// sequelize
let sequelizePool = {};
let already_init = false;
const initSequelize = (config) => {
  if (already_init) return;
  already_init = true;
  Object.keys(config).forEach((db) => {
    const conn = new Sequelize(
      config[db].database,
      config[db].user,
      config[db].password,
      {
        host: config[db].host,
        port: config[db].port,
        dialect: "mariadb",
        dialectOptions: Object.assign(defaultOptions, {
          // Your mariadb options here
          // connectTimeout: 1000
          requestTimeout: 3000,
          useUTC: false, //for reading from database
          // timezone: "Etc/GMT+0", //for writing to database
          skipSetTimezone: true
        }),
        logging: debug,
        pool: {
          max: MYSQL_CONNECTION_POOL_SIZE,
          min: 0,
          idle: 10000
        }
      }
    );
    sequelizePool[db] = conn;
  });
};

/**
 * mysql version
 */
const mysql = require("mysql");
const MYSQL_CONNECTION_POOL_SIZE = 10;
const promisify = require("util").promisify;
let pools = {};
let poolCluster = {};
const setupMysql = async (config) => {
  poolCluster = mysql.createPoolCluster({
    restoreNodeTimeout: 1000
  });
  Object.keys(config).forEach((db) => {
    poolCluster.add(db, { ...config[db], ...defaultOptions });
    const pool = poolCluster.of(db, "RANDOM");
    pools[db] = pool;
    pool.query = promisify(pool.query);
    pool.getConnection = promisify(pool.getConnection);
  });
  for (const pool in pools) {
    await pools[pool].getConnection();
  }
};

// const releaseMysql = async () => {
//   poolCluster.end(error => {
//     if (error) console.log(error);
//   });
// };

module.exports = { mysql: pools, setupMysql, initSequelize, sequelizePool };
