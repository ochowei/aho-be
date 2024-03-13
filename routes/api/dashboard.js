const express = require('express');
const { auth } = require('express-oauth2-jwt-bearer');

const router = express.Router();
const { handleResponse } = require('../../services/common/response');
const service = require('../../services/dashboard/dashboardService');

const checkJWT = auth();

router.get(
  '/v1/users',
  checkJWT,
  service.listUsers,
  service.updateSessionTime,
  handleResponse,
);

router.get(
  '/v1/summary',
  checkJWT,
  service.summaryUsers,
  service.updateSessionTime,
  handleResponse,
);

module.exports = router;
