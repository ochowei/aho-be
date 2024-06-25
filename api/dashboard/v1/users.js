const express = require('express');
const { auth } = require('express-oauth2-jwt-bearer');

const router = express.Router();
const { handleResponse } = require('../../../services/common/response');
const service = require('../../../services/dashboard/dashboardService');
const {
  setupSequelize,
} = require('../../../middlewares/common/handler');

const checkJWT = auth();

router.get(
  '/api/dashboard/v1/users',
  checkJWT,
  setupSequelize,
  service.listUsers,
  service.updateSessionTime,
  handleResponse,
);

router.options(
  '/api/dashboard/v1/users',
  setupSequelize,
  (req, res) => {
    res.send();
  },
);

module.exports = router;
