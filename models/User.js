const { Model, DataTypes } = require('sequelize');

class User extends Model {}
const setupUser = async (sequelize) => {
  User.init({
    user_id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email_verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    name: DataTypes.STRING,
    nickname: DataTypes.STRING,
    picture: DataTypes.STRING,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
    last_login: DataTypes.DATE,
    last_ip: DataTypes.STRING,
    logins_count: DataTypes.INTEGER,
    family_name: DataTypes.STRING,
    given_name: DataTypes.STRING,
    locale: DataTypes.STRING,
  }, { sequelize, modelName: 'user' });
  await User.sync({ alter: true });
};
// Export the models
module.exports = { User, setupUser };
