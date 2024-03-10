const { Model, DataTypes } = require('sequelize');

class Identity extends Model {}
const setupIdentity = async (sequelize) => {
  Identity.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: DataTypes.STRING,
    provider: DataTypes.STRING,
    user_id_from_provider: DataTypes.STRING,
    connection: DataTypes.STRING,
    isSocial: DataTypes.BOOLEAN,
  }, { sequelize, modelName: 'identity' });
  await Identity.sync({ alter: true });
};
// Export the models
module.exports = { Identity, setupIdentity };
