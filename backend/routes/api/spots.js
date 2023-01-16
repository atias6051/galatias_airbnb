const express = require('express')
const router = express.Router();

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User,Spot,SpotImage,Review, sequelize, Sequelize } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

router.get('/',async(req,res,next)=>{
    const spots = await Spot.findAll({})
    let spotsObj = {Spots: []}
    for(let spot of spots){
        let newSpot = {...spot}
        const avg = await Review.findAll({
            where:{
                spotId: spot.id,
            },
            attributes: [[Sequelize.fn('AVG',Sequelize.col('stars')),'avgRating']]
        })
        const url = await SpotImage.findOne({
            where:{
                spotId: spot.id,
                preview: true
            },
            attributes: ['url']
        })
        newSpot.dataValues.avgRating = avg[0].dataValues.avgRating
        newSpot.dataValues.previewImage = url.dataValues.url

        spotsObj.Spots.push(newSpot.dataValues)
    }
    res.json(spotsObj)
})
// router.get('/',async(req,res,next)=>{
//     const spots = await Spot.findAll({
//         include:[{
//             model: SpotImage,
//             as: 'previewImage',
//             where: {
//                 preview: true
//             },
//             attributes: ['url']
//         },{
//             model: Review,
//             attributes: [[Sequelize.fn('AVG',Sequelize.col('stars')),'avgRating']]
//         }],
//         group: ['Spot.id']
//     })
//     res.json(spots)
// })


router.get('/test',async(req,res,next)=>{
    console.log(req)
    // console.log(req.user)
    res.json({message:'check terminal'})
})

router.get('/:spotId',async(req,res,next)=>{
    const spot = await Spot.findByPk(req.params.spotId,{
        include: [
            {
                model: Review,
                attributes:[]
            },
            {
                model: SpotImage,
                attributes:{
                    exclude: ['createdAt','updatedAt']
                }
            },
            {
                model: User,
                as: 'Owner',
                attributes:{
                    exclude: ['createdAt','updatedAt','hashedPassword']
                }
            }
        ],
        attributes: {
            include: [
                [sequelize.fn('COUNT',sequelize.col('stars')), 'numReviews'],
                [sequelize.fn('AVG',sequelize.col('stars')), 'avgStarRating']
            ]
        },
        // group: 'Spot.id'
    })
    // const reviews = await Review.findAll({
    //     where: {spotId: req.params.spotId},
    //     attributes:[
    //         [sequelize.fn('COUNT',sequelize.col('id')), 'numReviews'],
    //         [sequelize.fn('AVG',sequelize.col('stars')), 'avgStarRating'],
    //     ]
    // })
    // console.log(reviews[0].dataValues)
    res.json(spot)
    // const spot = await Spot.findByPk(req.params.spotId)
    // const reviews = await Review.findAll({
    //     where: {spotId: req.params.spotId},
    //     attributes:[
    //         [sequelize.fn('COUNT',sequelize.col('id')), 'numReviews'],
    //         [sequelize.fn('AVG',sequelize.col('stars')), 'avgStarRating'],
    //     ]
    // })
    // console.log(reviews[0].dataValues)
    // res.json(spot)
})

router.post('/',async(req,res,next)=>{

})
module.exports = router;
