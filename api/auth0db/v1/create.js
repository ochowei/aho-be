const express = require('express');

const router = express.Router();
const { handleResponse } = require('../../../services/common/response');
const service = require('../../../services/auth0db/service');
const { checkAuth0db, checkPassword, checkEmail } = require('../../../middlewares/common/handler');

router.put(
  '/api/auth0db/v1/create',
  checkAuth0db,
  checkEmail,
  checkPassword,
  service.create,
  handleResponse,
);

router.options(
  '/api/auth0db/v1/create',
  (req, res) => {
    res.send();
  },
);

const app = express();
app.use(router);

module.exports = router;
