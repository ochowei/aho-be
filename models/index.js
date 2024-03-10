const { setupUser } = require('./User');
const { setupIdentity } = require('./Identity');
const { setupUserMetadata } = require('./UserMetadata');
const { setupUserAuth } = require('./UserAuth');

const setupModels = async (sequelize) => {
  await setupUser(sequelize);
  await setupIdentity(sequelize);
  await setupUserMetadata(sequelize);
  await setupUserAuth(sequelize);
};

module.exports = { setupModels };
