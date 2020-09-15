'use strict';
module.exports = (sequelize, DataTypes) => {
  const user_teams = sequelize.define('user_teams', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV1
    },
    userId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    teamId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "awaiting",
      allowNull: true,
    }
  }, {});
  user_teams.associate = function(models) {
    user_teams.belongsTo(models.User, { foreignKey: 'userId' });
    user_teams.belongsTo(models.teams, {foreignKey: 'teamId'})
    // associations can be defined here
  };
  return user_teams;
};