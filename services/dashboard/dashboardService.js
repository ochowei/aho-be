// const { auth } = require('express-oauth2-jwt-bearer');
const helper = require('./dashboardHelper');

const self = {

  listUsers: async (req, res, next) => {
    const { page = 1, pageSize = 5 } = req.query;
    let sub = req.auth?.payload?.sub;
    if (!sub) {
      sub = req.headers.sub;
    }
    const users = await helper.listUsers(sub, Number(page), Number(pageSize));
    res.response = { data: users };
    next();
  },

  summaryUsers: async (req, res, next) => {
    let sub = req.auth?.payload?.sub;
    if (!sub) {
      sub = req.headers.sub;
    }
    const summary = await helper.summaryUsers(sub);
    res.response = { data: summary };
    next();
  },

  updateSessionTime: async (req, res, next) => {
    let sub = req.auth?.payload?.sub;
    const iat = req.auth?.payload?.iat;
    if (iat) {
      await helper.updateSessionTime(sub, new Date(iat * 1000));
    }

    if (!sub) {
      sub = req.headers.sub;
    }

    await helper.updateSessionTime(sub);
    next();
  },
};

module.exports = self;
