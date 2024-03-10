const express = require('express');

const router = express.Router();
const { handleResponse } = require('../../services/common/response');

router.get(
  '/v1/world',
  (req, res, next) => {
    res.response = { msg: 'hello world' };
    next();
  },
  handleResponse,
);

module.exports = router;
