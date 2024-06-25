const express = require('express');

const router = express.Router();
const { handleResponse } = require('../../../services/common/response');
const service = require('../../../services/auth0db/service');
const {
  checkAuth0db, setupSequelize,
} = require('../../../middlewares/common/handler');

router.delete(
  '/api/auth0db/v1/remove',
  checkAuth0db,
  setupSequelize,
  service.remove,
  handleResponse,
);

router.options(
  '/api/auth0db/v1/remove',
  setupSequelize,
  (req, res) => {
    res.send();
  },
);

const app = express();
app.use(router);

module.exports = router;
