const express = require('express');

const router = express.Router();
const { handleResponse } = require('../../services/common/response');

router.get('/v1/', (req, res) => {
  res.send({ user_id: '123', nickname: 'mock-user', email: 'mock@mock.org' });
});

router.post(
  '/v1/',
  (req, res, next) => {
    // eslint-disable-next-line no-unused-vars
    const { email, password } = req.body;
    res.response = { data: { user_id: '123', nickname: 'mock-user', email } };
    next();
  },
  handleResponse,
);

module.exports = router;
