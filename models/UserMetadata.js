const { Model, DataTypes } = require('sequelize');

class UserMetadata extends Model {}
const setupUserMetadata = async (sequelize) => {
  UserMetadata.init({
    user_id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    metadata_key: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    metadata_value: DataTypes.TEXT,
  }, { sequelize, modelName: 'userMetadata' });
  await UserMetadata.sync({ alter: true });
};
// Export the models
module.exports = { UserMetadata, setupUserMetadata };
