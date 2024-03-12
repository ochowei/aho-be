const { Model, DataTypes } = require('sequelize');

class Identity extends Model {}
const setupIdentity = async (sequelize) => {
  Identity.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: DataTypes.INTEGER,
    provider: DataTypes.STRING,
    userIdFromProvider: DataTypes.STRING,
    connection: DataTypes.STRING,
    isSocial: DataTypes.BOOLEAN,
  }, {
    sequelize, modelName: 'identity', engine: 'InnoDB', charset: 'utf8', collate: 'utf8_general_ci',
  });
  await Identity.sync({ alter: false });
};
// Export the models
module.exports = { Identity, setupIdentity };
