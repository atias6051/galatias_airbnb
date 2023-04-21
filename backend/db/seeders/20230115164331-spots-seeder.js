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
        address: '2644 Monte Vista Ave',
        city: 'El Cerito',
        state: 'CA',
        country: 'United States',
        lat: 37.9378128,
        lng: -122.3104638,
        name: 'Chic Studio Retreat in El Cerrito',
        description: "This stylish and cozy studio retreat in El Cerrito is the perfect home base for exploring the Bay Area. With a fully equipped kitchenette, a comfortable queen-size bed, and a modern bathroom, this studio is perfect for solo travelers or couples. Relax in the comfortable seating area with a book, or explore nearby restaurants, shops, and parks. San Francisco and Berkeley are just a short drive or train ride away. Book now and experience the best of Bay Area living in this chic studio retreat!",
        price: 130.00
      },
      {
        ownerId: 2,
        address: '265 Lee St',
        city: 'Oakland',
        state: 'CA',
        country: 'United States',
        lat: 37.8122886,
        lng: -122.257368,
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
        lat: 37.5602651,
        lng: -122.26436,
        name: 'Modern Waterfront Apartment in Foster City',
        description: "This sleek and modern one-bedroom apartment is located on the waterfront in Foster City, offering stunning views of the Bay. With a fully equipped kitchen, comfortable living room, and a king-size bed, this apartment is perfect for couples or solo travelers. Take a morning walk along the scenic promenade, enjoy a workout in the on-site gym, or take a dip in the heated pool. Restaurants and shops are just a short walk away. Book now and experience the best of waterfront living in Foster City!",
        price: 155.00
      },
      {
        ownerId: 1,
        address: '1913 Meadow Rd',
        city: 'Walnut Creek',
        state: 'CA',
        country: 'USA',
        lat: 37.8805568,
        lng: -122.057399,
        name: 'Cozy Retreat in the Heart of Walnut Creek',
        description: "This beautifully decorated one-bedroom apartment is located in the heart of Walnut Creek, just steps away from all the city has to offer. Featuring a fully equipped kitchen, comfortable living room, and a plush queen-size bed, this cozy retreat is perfect for couples or solo travelers. Enjoy a morning coffee on the balcony, or take a stroll to nearby restaurants, shops, and parks. Book now and experience the best of Walnut Creek living!",
        price: 155.00
      },
      {
        ownerId: 2,
        address: '25 Cam Encinas',
        city: 'Orinda',
        state: 'CA',
        country: 'USA',
        lat: 37.8756029,
        lng: -122.180081,
        name: 'Serene Escape in Orinda Hills',
        description: "This stunning three-bedroom house nestled in the Orinda hills offers a serene escape from the hustle and bustle of the city. With a spacious living room, modern kitchen, and breathtaking views of the surrounding nature, this house is perfect for families or groups of friends. Enjoy a morning hike in nearby trails, relax on the large deck with a glass of wine, or curl up with a book in front of the fireplace. Book now and experience the tranquil beauty of Orinda!",
        price: 75.00
      },
      {
        ownerId: 4,
        address: '555 Howard St',
        city: 'San Francisco',
        state: 'CA',
        country: 'USA',
        lat: 37.788090,
        lng: -122.397650,
        name: 'Luxurious Condo in Downtown SF',
        description: "This luxurious condo in the heart of San Francisco features stunning city views and high-end amenities. With two spacious bedrooms, a fully equipped kitchen, and a comfortable living room, this condo is perfect for families or groups of friends. Enjoy the rooftop pool, fitness center, and lounge area, or explore the city's famous landmarks and restaurants just steps away. Book now and experience the best of San Francisco living!",
        price: 350.00
        },
        {
        ownerId: 2,
        address: '4404 Oakhill Rd',
        city: 'Oakland',
        state: 'CA',
        country: 'USA',
        lat: 37.801233,
        lng: -122.184230,
        name: 'Bright and Modern Apartment in Oakland',
        description: "This bright and modern one-bedroom apartment in Oakland is the perfect retreat for solo travelers or couples. With a fully equipped kitchen, comfortable living room, and a cozy bedroom with a queen-size bed, this apartment has everything you need for a comfortable stay. Enjoy a morning coffee on the balcony, or explore nearby restaurants, shops, and parks. Book now and experience the best of Oakland living!",
        price: 120.00
        },
        {
        ownerId: 3,
        address: '3452 Adeline St',
        city: 'Berkeley',
        state: 'CA',
        country: 'USA',
        lat: 37.847660,
        lng: -122.267280,
        name: 'Charming Cottage in Berkeley',
        description: "This charming cottage in Berkeley is the perfect escape for those looking for peace and tranquility. With a fully equipped kitchen, a comfortable living room, and a cozy bedroom with a queen-size bed, this cottage is perfect for solo travelers or couples. Relax on the private patio surrounded by lush greenery, or take a stroll to nearby cafes, restaurants, and shops. Book now and experience the best of Berkeley living!",
        price: 95.00
        },
        {
        ownerId: 5,
        address: '1408 Miramonte Ave',
        city: 'Mountain View',
        state: 'CA',
        country: 'USA',
        lat: 37.380180,
        lng: -122.078480,
        name: 'Spacious House with a Pool in Mountain View',
        description: "This spacious and modern house in Mountain View is perfect for families or groups of friends. With four comfortable bedrooms, a fully equipped kitchen, and a spacious living room, this house has everything you need for a comfortable stay. Enjoy the outdoor pool and hot tub, or take a short drive to nearby Silicon Valley landmarks and attractions. Book now and experience the best of Mountain View living!",
        price: 450.00
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots'
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options,{
      country: {[Op.in]: ['USA']}
    },{})
  }
};
