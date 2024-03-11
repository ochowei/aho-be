const helper = require('./helper');

const self = {
  login: async (req, res, next) => {
    /** @type {{email: string, password: string}} */
    const { email, password } = req.body;
    const comparePassword = await helper.comparePassword(email, password);
    if (!comparePassword) {
      res.response = { msg: 'login failed' };
      return next();
    }
    res.response = { msg: 'login success' };
    return next();
  },
  create: async (req, res, next) => {
    /** @type {{email: string, password: string}} */
    const { email, password } = req.body;
    try {
      await helper.createUser(email, password);
      res.response = { msg: 'create user success' };
    } catch (err) {
      res.response = { msg: 'create user failed' };
    } finally {
      next();
    }
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
        res.response = { msg: 'change password failed' };
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
    } catch (err) {
      res.response = { msg: 'login failed' };
    } finally {
      next();
    }
  },
  remove: async (req, res, next) => {
    /** @type {{id: *}} */
    const { id } = req.body;
    const logger = console;
    logger.log('remove', id);
    res.response = { msg: 'remove success' };
    next();
  },
};
module.exports = self;
