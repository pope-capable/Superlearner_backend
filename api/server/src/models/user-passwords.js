'use strict';
module.exports = (sequelize, DataTypes) => {
  const user_passwords = sequelize.define('user_passwords', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV1
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
  }, {});
  user_passwords.associate = function(models) {
    user_passwords.belongsTo(models.User, { foreignKey: 'userId' });
    // associations can be defined here
  };
  return user_passwords;
};