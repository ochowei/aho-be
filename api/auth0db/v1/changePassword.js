const express = require('express');

const router = express.Router();
const { handleResponse } = require('../../../services/common/response');
const service = require('../../../services/auth0db/service');
const {
  checkAuth0db, setupSequelize, checkEmail, checkPassword,
} = require('../../../middlewares/common/handler');

router.put(
  '/api/auth0db/v1/changePassword',
  checkAuth0db,
  checkEmail,
  checkPassword,
  setupSequelize,
  service.changePassword,
  handleResponse,
);

router.options(
  '/api/auth0db/v1/changePassword',
  setupSequelize,
  (req, res) => {
    res.send();
  },
);

const app = express();
app.use(router);

module.exports = router;
