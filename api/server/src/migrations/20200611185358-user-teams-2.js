'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('user-teams'),    
    queryInterface.createTable('user_teams', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      status: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: "awaiting"
      },
      isAdmin: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
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
      teamId: {
        type:Sequelize.UUID,
        onDelete: 'cascade',
        onUpdate: 'cascade',

        references: {
            model: 'teams',
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
    return queryInterface.dropTable('user_teams');
  }
};
