const express = require('express');
const { auth } = require('express-oauth2-jwt-bearer');

const router = express.Router();
const { handleResponse } = require('../../services/common/response');
const service = require('../../services/user/userService');

const checkJWT = auth();

router.post(
  '/v1/verification/email',
  checkJWT,
  service.sendVerificationEmail,
  handleResponse,
);

router.post(
  '/v1/afterauth',
  checkJWT,
  service.incrUserLoginCount,
  service.updateSocialUserProfile,
  handleResponse,
);

module.exports = router;
