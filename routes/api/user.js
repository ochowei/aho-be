const express = require('express');

const router = express.Router();
const { handleResponse } = require('../../services/common/response');
const service = require('../../services/user/service');

router.post(
  '/v1/verification/send',
  service.sendVerificationEmail,
  handleResponse,
);

module.exports = router;
