'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('disks', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV1,
        primaryKey: true,
      },
      allocated: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 2000
      },
      used: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false
      },
      userId: {
        type:Sequelize.UUID,
        onDelete: 'cascade',
        onUpdate: 'cascade',

        references: {
            model: 'Users',
            key: 'id',
            deferrable: Sequelize.Deferrable.INITIALLY_DEFERRED,
            onDelete: 'cascade',
            onUpdate: 'cascade',
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('disks');
  }
};