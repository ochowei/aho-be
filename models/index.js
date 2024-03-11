const { setupUser, User } = require('./User');
const { setupIdentity, Identity } = require('./Identity');
const { setupUserMetadata, UserMetadata } = require('./UserMetadata');
const { setupUserAuth, UserAuth } = require('./UserAuth');

const setupModels = async (sequelize) => {
  await setupUser(sequelize);
  await setupIdentity(sequelize);
  await setupUserMetadata(sequelize);
  await setupUserAuth(sequelize);
};

const models = {
  User,
  Identity,
  UserMetadata,
  UserAuth,
};

module.exports = { setupModels, models };
