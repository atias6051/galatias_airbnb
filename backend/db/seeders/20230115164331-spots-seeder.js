'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Spots'
    await queryInterface.bulkInsert(options,[
      {
        ownerId: 1,
        address: '66 Falling Brook Rd',
        city: 'Victor',
        state: 'NY',
        country: 'United States',
        lat: 43.879102,
        lng: -103.459067,
        name: 'House not on the beach',
        description: "Beautiful place not on the beach. in fact, it's not even close.",
        price: 130.00
      },
      {
        ownerId: 2,
        address: '265 Lee St',
        city: 'Oakland',
        state: 'CA',
        country: 'United States',
        lat: 23.879102,
        lng: 3.459057,
        name: 'Apartment for short term rent',
        description: "This apartment will signal to all of your friends and family that you failed miserably",
        price: 40.00
      },
      {
        ownerId: 3,
        address: '78 Abir Mark St',
        city: 'Tel-Aviv',
        state: 'Israel',
        country: 'Israel',
        lat: 104.834102,
        lng: -23.434067,
        name: 'Private house close to the water park',
        description: "Theres a water park like 2 blocks away. do you really need anything else?",
        price: 155.00
      },
      {
        ownerId: 1,
        address: '1500 Goose Way',
        city: 'Paris',
        state: 'France',
        country: 'Rfance',
        lat: 24.834102,
        lng: -213.434067,
        name: 'This is the same house you know from the US in France',
        description: "No we do not have baguettes here. but theres unlimited tap water. youre welcome",
        price: 155.00
      },
      {
        ownerId: 2,
        address: '9 Bisbane Ln',
        city: 'Brisbane',
        state: 'Brisbane',
        country: 'Australia',
        lat: 224.834102,
        lng: -13.434067,
        name: 'Surfers place llc',
        description: "Get your surf board and surf every day! and if you dont know how to surf look for the oakland apartment",
        price: 75.00
      },

    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots'
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options,{
      city: {[Op.in]: ['Victor','Oakland','Tel-Aviv','Paris','Brisbane']}
    },{})
  }
};
