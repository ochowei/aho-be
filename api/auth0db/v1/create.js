const express = require('express');

const router = express.Router();
const { handleResponse } = require('../../../services/common/response');
const service = require('../../../services/auth0db/service');
const {
  checkAuth0db, checkPassword, checkEmail, setupSequelize,
} = require('../../../middlewares/common/handler');

router.post(
  '/api/auth0db/v1/create',
  checkAuth0db,
  checkEmail,
  checkPassword,
  setupSequelize,
  service.create,
  handleResponse,
);

router.options(
  '/api/auth0db/v1/create',
  setupSequelize,
  (req, res) => {
    res.send();
  },
);

const app = express();
app.use(router);

module.exports = router;
