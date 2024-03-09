const config = require("../config");
const {
  setupMysql,
  initSequelize,
  sequelizePool
} = require("../connections/mysql");

initSequelize(config.mysql); 

// global set up before all test
exports.mochaGlobalSetup = async function () {
  console.log("********* Unit Test Start *********");
  console.log(`[ENV]: ${process.env.ENV}`);

  process.on("unhandledRejection", (err) => {
    console.log(err);
    throw err;
  });
  const sync_db = async function () {
    await sequelizePool.master.query("SET FOREIGN_KEY_CHECKS = 0");

    await sequelizePool.master
      .sync({ force: true })
      .then((_) => console.log("create master table"));
  };

  await Promise.all([
    // a new function
    sync_db()
  ]);
  await Promise.all([
    setupMysql(config.mysql).then((_) => {
      console.log("[MYSQL] connect to mysql successful");
    })
  ]);
};
