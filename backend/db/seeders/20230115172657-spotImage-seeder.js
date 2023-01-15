'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'SpotImages'
    return queryInterface.bulkInsert(options,[
      {
        spotId: 1,
        url: 'https://lovehomedesigns.com/wp-content/uploads/2021/12/suburban-house-style-122221.jpg',
        preview: true
      },
      {
        spotId: 2,
        url: 'https://media.istockphoto.com/id/973596152/photo/old-kitchen-of-a-communal-flat-in-st-petersburg-russia.jpg?s=612x612&w=0&k=20&c=AjDa9SgC3oIXZA_f7GIESlr6_ICHUqUFKOm6BwIbIXU=',
        preview: true
      },
      {
        spotId: 3,
        url: 'https://www.carscoops.com/wp-content/uploads/2020/11/Aston-Martin-NY-Apartment-11.jpg',
        preview: true
      },
      {
        spotId: 4,
        url: 'https://static.reuters.com/resources/r/?m=02&d=20210218&t=2&i=1552009917&r=LYNXMPEH1H12P&w=780',
        preview: true
      },
      {
        spotId: 5,
        url: 'https://www.surforsound.com/media/3340016/surf-or-sound-realty-salty-dog-beach-house-869-exterior.jpg',
        preview: true
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options,{
      spotId: {[Op.in]: [1,2,3,4,5]}
    },{})
  }
};
