const helper = require('./helper');
const { RESPONSE_CODE } = require('../../helpers/common/response');
const logger = require('../../helpers/common/log')('auth0db');

const self = {
  login: async (req, res, next) => {
    /** @type {{email: string, password: string}} */
    const { email, password } = req.body;
    try {
      const user = await helper.comparePassword(email, password);
      res.response = { data: user };
    } catch (err) {
      logger.error(err);
      res.response = { code: RESPONSE_CODE.UNAUTHORIZED, msg: err.msg };
    }
    next();
  },
  create: async (req, res, next) => {
    /** @type {{email: string, password: string}} */
    const { email, password } = req.body;
    try {
      await helper.createUser(email, password);
      res.response = { msg: 'create user success' };
    } catch (err) {
      res.response = { code: RESPONSE_CODE.USERID_EXIST, msg: err.message };
    }
    next();
  },
  verify: async (req, res, next) => {
    /** @type {{email: string}} */
    const { email } = req.body;
    try {
      const verifyResult = await helper.verify(email);
      if (!verifyResult) {
        res.response = { msg: 'verify failed' };
      }
      res.response = { msg: 'verify success' };
    } catch (err) {
      res.response = { msg: 'verify failed' };
    } finally {
      next();
    }
  },
  changePassword: async (req, res, next) => {
    /** @type {{email: string, password: string}} */
    const { email, password } = req.body;
    try {
      const changePasswordResult = await helper.changePassword(email, password);
      if (changePasswordResult) {
        res.response = { msg: 'change password success' };
      } else {
        res.response = { code: RESPONSE_CODE.NOT_FOUND, msg: 'User not found' };
      }
    } catch (err) {
      res.response = { msg: err.message };
    } finally {
      next();
    }
  },
  loginByEmail: async (req, res, next) => {
    /** @type {{email: string}} */
    const { email } = req.body;
    try {
      const user = await helper.loginByEmail(email);

      res.response = { data: user };
      next();
    } catch (err) {
      res.response = { code: RESPONSE_CODE.NOT_FOUND, msg: err.message };

      next();
    }
  },
  remove: async (req, res, next) => {
    /** @type {{id: *}} */
    const { id } = req.body;
    try {
      await helper.remove(Number(id));
      res.response = { msg: 'remove success' };
    } catch (err) {
      res.response = { code: RESPONSE_CODE.NOT_FOUND, msg: err.message };
    } finally {
      next();
    }
  },
};
module.exports = self;
