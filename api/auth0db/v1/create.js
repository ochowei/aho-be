const express = require('express');

const router = express.Router();
const { handleResponse } = require('../../../services/common/response');
const service = require('../../../services/auth0db/service');
const { checkAuth0db, checkPassword, checkEmail } = require('../../../middlewares/common/handler');

const { initSequelize } = require('../../../connections/mysql');

const mysqlConfig = {
  master: {
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    ca: process.env.MYSQL_CA,
  },
};
initSequelize(mysqlConfig); // TODO: error handle

router.post(
  '/api/auth0db/v1/create',
  checkAuth0db,
  checkEmail,
  checkPassword,
  service.create,
  handleResponse,
);

router.options(
  '/api/auth0db/v1/create',
  (req, res) => {
    res.send();
  },
);

const app = express();
app.use(router);

module.exports = router;
