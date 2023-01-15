'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Bookings'
    return queryInterface.bulkInsert(options,[
      {
        spotId: 1,
        userId: 2,
        startDate: '2023-02-02',
        endDate: '2023-04-04',
      },
      {
        spotId: 5,
        userId: 1,
        startDate: '2024-02-02',
        endDate: '2024-04-04',
      },
      {
        spotId: 2,
        userId: 3,
        startDate: '2023-03-03',
        endDate: '2023-04-04',
      },
      {
        spotId: 3,
        userId: 1,
        startDate: '2024-02-04',
        endDate: '2024-05-05',
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options,{
      spotId: {[Op.in]: [1,2,3,4,5]}
    },{})
  }
};
