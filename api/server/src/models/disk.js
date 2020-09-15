'use strict';
module.exports = (sequelize, DataTypes) => {
  const disk = sequelize.define('disk', {
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
    allocated: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 2000
    },
    used: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  }, {});
  disk.associate = function(models) {
    disk.belongsTo(models.User, { foreignKey: 'userId' });
    // associations can be defined here
  };
  return disk;
};