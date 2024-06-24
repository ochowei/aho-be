const express = require('express');

const router = express.Router();
const { handleResponse } = require('../../../services/common/response');
const service = require('../../../services/auth0db/service');
const { checkAuth0db, checkEmail } = require('../../../middlewares/common/handler');

router.put(
  '/api/auth0db/v1/login',
  checkAuth0db,
  checkEmail,
  service.login,
  handleResponse,
);
module.exports = router;
