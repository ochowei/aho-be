const helper = require('./helper');

const self = {

  listUsers: async (req, res, next) => {
    const { page = 1, pageSize = 20 } = req.query;
    const users = await helper.listUsers(page, pageSize);
    res.response = { data: users };
    next();
  },
  summaryUsers: async (req, res, next) => {
    const timezone = req.headers['client-timezone'] || 'Asia/Taipei';
    const summary = await helper.summaryUsers(timezone);
    res.response = { data: summary };
    next();
  },
};

module.exports = self;
