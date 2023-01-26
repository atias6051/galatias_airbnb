'use strict';
/** @type {import('sequelize-cli').Migration} */
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Spots', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ownerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {model: 'Users'},
        onDelete: 'CASCADE'
      },
      address: {
        type: Sequelize.STRING,
        allowNull:null
      },
      city: {
        type: Sequelize.STRING,
        allowNull:null
      },
      state: {
        type: Sequelize.STRING,
        allowNull:null
      },
      country: {
        type: Sequelize.STRING,
        allowNull:null
      },
      lat: {
        type: Sequelize.FLOAT,
        allowNull:null
      },
      lng: {
        type: Sequelize.FLOAT,
        allowNull:null
      },
      name: {
        type: Sequelize.STRING,
        allowNull:null
      },
      description: {
        type: Sequelize.STRING,
        allowNull:null
      },
      price: {
        type: Sequelize.FLOAT,
        allowNull:null
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    },options);
  },
  async down(queryInterface, Sequelize) {
    options.tableName = "Spots";
    await queryInterface.dropTable(options);
  }
};
