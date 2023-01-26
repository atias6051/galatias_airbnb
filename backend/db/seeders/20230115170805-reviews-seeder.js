'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Reviews'
    return queryInterface.bulkInsert(options,[
      {
        spotId:1,
        userId:2,
        review: 'Very nice place. would love to come again',
        stars: 5
      },
      {
        spotId:2,
        userId:3,
        review: 'Please help me get out of here! stuck in the 2nd bedroom',
        stars: 2
      },
      {
        spotId:4,
        userId:1,
        review: 'Ok i thought the no baguette thing was a joke but they really have non here. WTF?!',
        stars: 1
      },
      {
        spotId:3,
        userId:3,
        review: 'great place but super expensive!!! got no money left!',
        stars: 4
      },
      {
        spotId:5,
        userId:1,
        review: 'Greatest vacation home on the beach! the whole family loved it!',
        stars: 5
      },
      {
        spotId:1,
        userId:3,
        review: 'theres no beach close to this place. Ill try swimming in the lake and let you know how it was',
        stars: 3
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options,null,{})
  }
  // ,{
  //   spotId: {[Op.in]: [1,2,3,4,5]}
  // },{}
};
