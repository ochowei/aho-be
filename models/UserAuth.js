const { Model, DataTypes } = require('sequelize');

class UserAuth extends Model {}
const setupUserAuth = async (sequelize) => {
  UserAuth.init({
    user_id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    encrypted_password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  }, {
    sequelize, modelName: 'userAuth', timestamps: true, updatedAt: 'updated_at', createdAt: 'created_at',
  });
  await UserAuth.sync({ alter: true });
};

// Export the model
module.exports = { setupUserAuth, UserAuth };
