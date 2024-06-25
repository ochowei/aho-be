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
  '/api/dashboard/v1/summary',
  checkJWT,
  setupSequelize,
  service.summaryUsers,
  service.updateSessionTime,
  handleResponse,
);

router.options(
  '/api/dashboard/v1/summary',
  setupSequelize,
  (req, res) => {
    res.send();
  },
);

const app = express();
app.use(router);

module.exports = app;
