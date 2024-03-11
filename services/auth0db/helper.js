const bcrypt = require('bcrypt');

const { models } = require('../../models');

const provider = 'authdb';

const bcryptSaltRounds = 10;

const self = {
  /**
     *
     * @param {string} email
     * @param {string} password
     * @returns {Promise<{user_id: string,
     *  nickname: string,
     *  email: string,
     *  emailVerified: string}>}
     */
  comparePassword: async (email, password) => {
    const userAuth = await models.UserAuth.findOne({
      where: {
        email,
      },
    });
    if (!userAuth) {
      throw new Error('User not found');
    }
    const storedHash = userAuth.encryptedPassword;
    const r = await bcrypt.compare(password, storedHash);
    if (!r) {
      throw new Error('Password is incorrect');
    }
    const sub = `${provider}|${email}`;
    const user = await models.User.findOne({
      where: {
        sub,
      },
    });
    if (!user) {
      throw new Error('User not found');
    }
    return {
      user_id: user.userId,
      nickname: user.nickname,
      email: user.email,
      emailVerified: user.emailVerified,
    };
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
      throw new Error('User not found');
    }
    return { user_id: user.userId, nickname: user.nickname, email: user.email };
  },
  /**
   * @param {number} id
   * @returns {Promise<void>}
   */
  remove: async (id) => {
    const user = await models.User.findOne({
      where: {
        userId: id,
      },
    });
    const { email } = user;
    await user.destroy();
    await models.UserAuth.destroy({
      where: {
        email,
      },
    });
  },
};
module.exports = self;
