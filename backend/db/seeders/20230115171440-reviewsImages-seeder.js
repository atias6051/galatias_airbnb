'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'ReviewImages'
    return queryInterface.bulkInsert(options,[
      {
        reviewId: 1,
        url: 'https://images.familyhomeplans.com/cdn-cgi/image/fit=scale-down,quality=85/plans/51981/51981-b580.jpg'
      },
      {
        reviewId: 2,
        url: 'https://i.insider.com/60a3dbfff27b4c00194450e5?width=1000&format=jpeg&auto=webp'
      },
      {
        reviewId: 3,
        url: 'https://www.mlive.com/resizer/mO-FNaWhLoDo_qPl1tgt98UOH2k=/1280x0/smart/cloudfront-us-east-1.images.arcpublishing.com/advancelocal/P2JR4V52XFH55KEZ5G6KJDNNO4.jpg'
      },
      {
        reviewId: 4,
        url: 'https://www.homebunch.com/wp-content/uploads/2021/04/interior-design-ideas-Marn_SHIE_web_513.jpg'
      },
      {
        reviewId: 5,
        url: 'https://www.southernliving.com/thmb/TpBWstLomyLGW-NGjqTS6BRbNrE=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/0a90eaf5-77f8-47f1-bf9b-ffff21198fc4-08c158a65728419ea884cf948580b836.jpg'
      },
      {
        reviewId: 2,
        url: 'https://badgerherald.com/wp-content/uploads/2005/04/worsthouse_BF_416.jpg'
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'ReviewImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options,null,{})
    // return queryInterface.bulkDelete(options,{
    //   reviewId: {[Op.in]: [1,2,3,4,5,6]}
    // },{})
  }
};
