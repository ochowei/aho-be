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
    lastLogin: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
    lastSession: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
    lastSessionDateOnly: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
    lastIp: DataTypes.STRING,
    loginsCount: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      allowNull: false,
    },
    familyName: DataTypes.STRING,
    givenName: DataTypes.STRING,
    locale: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'user',
    engine: 'InnoDB',
    charset: 'utf8',
    collate: 'utf8_general_ci',
    indexes: [
      {
        fields: ['lastSessionDateOnly'],
      },
      {
        fields: ['lastSession'],
      },
    ],
  });
  await User.sync({ alter: false });
};
// Export the models
module.exports = { User, setupUser };
