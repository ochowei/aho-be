const { Model, DataTypes } = require('sequelize');

class User extends Model {}
const setupUser = async (sequelize) => {
  User.init({
    userId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    sub: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    emailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    name: DataTypes.STRING,
    nickname: DataTypes.STRING,
    picture: DataTypes.STRING,
    lastLogin: DataTypes.DATE,
    lastSession: DataTypes.DATE,
    lastIp: DataTypes.STRING,
    loginsCount: DataTypes.INTEGER,
    familyName: DataTypes.STRING,
    givenName: DataTypes.STRING,
    locale: DataTypes.STRING,
  }, {
    sequelize, modelName: 'user', engine: 'InnoDB', charset: 'utf8', collate: 'utf8_general_ci',
  });
  await User.sync({ alter: true });
};
// Export the models
module.exports = { User, setupUser };
