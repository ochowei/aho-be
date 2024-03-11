const bcrypt = require('bcrypt');

const { models } = require('../../models');

const provider = 'authdb';

const bcryptSaltRounds = 10;

const self = {
  /**
     *
     * @param {string} email
     * @param {string} password
     * @returns {Promise<boolean>}
     */
  comparePassword: async (email, password) => {
    const userAuth = await models.UserAuth.findOne({
      where: {
        email,
      },
    });
    const storedHash = userAuth.encryptedPassword;
    const r = await bcrypt.compare(password, storedHash);
    return r;
  },

  /**
   *
   * @param {string} email
   * @param {string} password
   */
  createUser: async (email, password) => {
    const sub = `${provider}|${email}`;

    const encryptedPassword = await bcrypt.hash(password, bcryptSaltRounds);
    await models.User.create({
      email,
      sub,
    });
    await models.UserAuth.create({
      email,
      encryptedPassword,
    });
  },

  /**
   *
   * @param {string} email
   * @returns {Promise<boolean>}
   */
  verify: async (email) => {
    const sub = `${provider}|${email}`;
    const [updateResult] = await models.User.update({
      emailVerified: true,
    }, {
      where: {
        sub,
        emailVerified: false,
      },
      limit: 1,
    });
    return !!updateResult;
  },
  changePassword: async (email, password) => {
    const encryptedPassword = await bcrypt.hash(password, bcryptSaltRounds);
    const userAuth = await models.UserAuth.findOne({
      where: {
        email,
      },
    });
    if (!userAuth) {
      throw new Error('User not found');
    }
    const oldEncryptedPassword = userAuth.encryptedPassword;
    if (oldEncryptedPassword === encryptedPassword) {
      throw new Error('New password is the same as the old password');
    }
    userAuth.encryptedPassword = encryptedPassword;
    await userAuth.save();
    return true;
  },
  loginByEmail: async (email) => {
    const user = await models.User.findOne({
      where: {
        email,
      },
    });
    if (!user) {
      return { user_id: '', email: '', nickname: '' };
    }
    return { user_id: user.userId, nickname: user.nickname, email: user.email };
  },
};
module.exports = self;
