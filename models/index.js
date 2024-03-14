const { setupUser, User } = require('./User');
const { setupUserAuth, UserAuth } = require('./UserAuth');

const setupModels = async (sequelize) => {
  await setupUser(sequelize);
  await setupUserAuth(sequelize);
};

const models = {
  User,
  UserAuth,
};

module.exports = { setupModels, models };
