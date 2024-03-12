const express = require('express');
const { auth } = require('express-oauth2-jwt-bearer');

const router = express.Router();
const { handleResponse } = require('../../services/common/response');
const service = require('../../services/dashboard/service');

const checkJWT = auth();

router.get(
  '/v1/users',
  checkJWT,
  service.listUsers,
  handleResponse,
);

router.get(
  '/v1/summary',
  checkJWT,
  service.summaryUsers,
  handleResponse,
);

module.exports = router;
