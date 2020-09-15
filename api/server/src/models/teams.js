'use strict';
module.exports = (sequelize, DataTypes) => {
  const teams = sequelize.define('teams', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV1
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false
    },  }, {});
  teams.associate = function(models) {
    // associations can be defined here
  };
  return teams;
};