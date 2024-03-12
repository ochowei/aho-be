const { models } = require('../../models');

const self = {

  getUser: async (email) => {
    const provider = 'authdb';
    const user = await models.User.findOne({
      where: {
        sub: `${provider}|${email}`,
      },
    });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  },
};
module.exports = self;
