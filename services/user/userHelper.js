const { models } = require('../../models');

const self = {

  getUser: async (userId) => {
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
};
module.exports = self;
