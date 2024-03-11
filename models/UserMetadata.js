const { Model, DataTypes } = require('sequelize');

class UserMetadata extends Model {}
const setupUserMetadata = async (sequelize) => {
  UserMetadata.init({
    userId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    metadataKey: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    metadataValue: DataTypes.TEXT,
  }, {
    sequelize, modelName: 'userMetadata', engine: 'InnoDB', charset: 'utf8', collate: 'utf8_general_ci',
  });
  await UserMetadata.sync({ alter: true });
};
// Export the models
module.exports = { UserMetadata, setupUserMetadata };
