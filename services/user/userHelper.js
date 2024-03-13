const { models } = require('../../models');

const self = {

  getUserFromUserId: async (userId) => {
    const user = await models.User.findOne({
      where: {
        userId,
      },
    });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  },
  /**
   *
   * @param {string} sub
   * @returns {Promise<{userId: number, sub: string}>}
   */
  getUserFromSub: async (sub) => {
    if (sub.startsWith('auth0|')) {
      const userId = Number(sub.replace('auth0|', ''));
      const user = await models.User.findOne({
        where: {
          userId,
        },
        attributes: ['userId', 'sub'],
      });
      if (!user) {
        throw new Error('User not found');
      }
      return {
        userId: user.userId,
        sub: user.sub,
      };
    }
    const user = await models.User.findOne({
      where: {
        sub,
      },
      attributes: ['userId', 'sub'],
    });
    if (!user) {
      return { userId: -1, sub };
    }

    return {
      userId: user.userId,
      sub: user.sub,
    };
  },
  /**
   * @param {number} userId
   * @param {string} sub
   */
  incrUserLoginCount: async (userId, sub) => {
    const r = await models.User.increment('loginsCount', {
      where: {
        userId,
      },
    });
    if (r.length === 0) {
      await models.User.create({
        sub,
      });
    }
  },
  upsertUserProfile: async (user) => {
    const { userId } = user;
    await models.User.upsert({
      userId,
      ...user,
    }, {
      fields: ['userId', 'email', 'name', 'picture', 'sub'],
    });
  },

};
module.exports = self;
