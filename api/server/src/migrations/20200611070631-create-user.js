'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Users', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      user_name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
      },
      first_name: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: false
      },
      last_name: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: false
      },
      complete: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      profile_picture: {
        type: Sequelize.STRING,
        defaultValue: "https://images.unsplash.com/photo-1578320339911-5e7974b2720a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2136&q=80",
        allowNull: false
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
    return queryInterface.dropTable('Users');
  }
};