const express = require('express');

const router = express.Router();
const { handleResponse } = require('../../services/common/response');
const service = require('../../services/auth0db/service');

router.put(
  '/v1/login',
  service.login,
  handleResponse,
);

router.post(
  '/v1/create',
  service.create,
  handleResponse,
);

router.put(
  '/v1/verify',
  service.verify,
  handleResponse,
);

router.put(
  '/v1/changePassword',
  service.changePassword,
  handleResponse,
);

router.get(
  '/v1/loginByEmail',
  service.loginByEmail,
  handleResponse,
);

// remove
router.delete(
  '/v1/remove',
  service.remove,
  handleResponse,
);

module.exports = router;
