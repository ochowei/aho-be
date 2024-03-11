const { Model, DataTypes } = require('sequelize');

class UserAuth extends Model {}
const setupUserAuth = async (sequelize) => {
  UserAuth.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    encryptedPassword: { // modified property name to camel case
      type: DataTypes.STRING,
      allowNull: false,
    },

  }, {
    sequelize, modelName: 'userAuth', engine: 'InnoDB', charset: 'utf8', collate: 'utf8_general_ci',
  }); // modified model name to camel case
  await UserAuth.sync({ alter: true });
};

// Export the model
module.exports = { setupUserAuth, UserAuth };
