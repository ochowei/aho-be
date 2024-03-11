const express = require('express');

const router = express.Router();
const { handleResponse } = require('../../services/common/response');
const service = require('../../services/auth0db/service');
const { checkAuth0db } = require('../../middlewares/common/handler');

router.put(
  '/v1/login',
  checkAuth0db,
  service.login,
  handleResponse,
);

router.post(
  '/v1/create',
  checkAuth0db,
  service.create,
  handleResponse,
);

router.put(
  '/v1/verify',
  checkAuth0db,
  service.verify,
  handleResponse,
);

router.put(
  '/v1/changePassword',
  checkAuth0db,
  service.changePassword,
  handleResponse,
);

router.put(
  '/v1/loginByEmail',
  checkAuth0db,
  service.loginByEmail,
  handleResponse,
);

// remove
router.delete(
  '/v1/remove',
  checkAuth0db,
  service.remove,
  handleResponse,
);

module.exports = router;
