const express = require('express');

const router = express.Router();
const { handleResponse } = require('../../../services/common/response');
const service = require('../../../services/auth0db/service');
const { checkAuth0db, checkEmail } = require('../../../middlewares/common/handler');

router.put(
  '/api/auth0db/v1/login',
  checkAuth0db,
  checkEmail,
  service.login,
  handleResponse,
);

router.options(
  '/api/auth0db/v1/login',
  (req, res) => {
    res.send();
  },
);

const app = express();
app.use(router);

module.exports = router;
