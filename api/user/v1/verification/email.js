const express = require('express');
const { auth } = require('express-oauth2-jwt-bearer');

const router = express.Router();
const { handleResponse } = require('../../../../services/common/response');
const service = require('../../../../services/user/userService');
const {
  setupSequelize,
} = require('../../../../middlewares/common/handler');

const checkJWT = auth();

router.post(
  '/api/user/v1/verification/email',
  checkJWT,
  setupSequelize,
  service.sendVerificationEmail,
  handleResponse,
);

router.options(
  '/api/user/v1/verification/email',
  setupSequelize,
  (req, res) => {
    res.send();
  },
);

const app = express();
app.use(router);

module.exports = app;
