const express = require('express');

const router = express.Router();
const { handleResponse } = require('../../services/common/response');

router.put(
  '/v1/login',
  (req, res, next) => {
    res.response = { msg: 'hello world' };
    next();
  },
  handleResponse,
);

router.post(
  '/v1/create',
  (req, res, next) => {
    res.response = { msg: 'hello world' };
    next();
  },
  handleResponse,
);

router.put(
  '/v1/verify',
  (req, res, next) => {
    res.response = { msg: 'hello world' };
    next();
  },
  handleResponse,
);

router.put(
  '/v1/changePassword',
  (req, res, next) => {
    res.response = { msg: 'hello world' };
    next();
  },
  handleResponse,
);

router.get(
  '/v1/loginByEmail',
  (req, res, next) => {
    res.response = { msg: 'hello world' };
    next();
  },
  handleResponse,
);

// remove
router.delete(
  '/v1/remove',
  (req, res, next) => {
    res.response = { msg: 'hello world' };
    next();
  },
  handleResponse,
);

module.exports = router;
