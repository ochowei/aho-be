const express = require('express');

const router = express.Router();
const { handleResponse } = require('../../services/common/response');
const service = require('../../services/dashboard/service');

router.get(
  '/v1/users',
  service.listUsers,
  handleResponse,
);

router.get(
  '/v1/summary',
  service.summaryUsers,
  handleResponse,
);

module.exports = router;
