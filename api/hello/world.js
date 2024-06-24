const express = require('express');

const router = express.Router();

const { handleResponse } = require('../../services/common/response');

const handler = (req, res, next) => {
  res.response = { msg: 'hello world' };
  next();
};

router.get('/api/hello/world', handler, handleResponse);

module.exports = router;
