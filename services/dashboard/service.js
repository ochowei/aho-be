// const { auth } = require('express-oauth2-jwt-bearer');
const helper = require('./helper');

const self = {

  listUsers: async (req, res, next) => {
    const { page = 1, pageSize = 5 } = req.query;
    const { sub = '|' } = req.headers;
    const users = await helper.listUsers(sub, Number(page), Number(pageSize));
    res.response = { data: users };
    next();
  },

  summaryUsers: async (req, res, next) => {
    const { sub = '|' } = req.headers;
    const summary = await helper.summaryUsers(sub);
    res.response = { data: summary };
    next();
  },
};

module.exports = self;
