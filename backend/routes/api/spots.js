const express = require('express')
const router = express.Router();

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User,Spot,SpotImage,Review, sequelize, Sequelize } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const review = require('../../db/models/review');
//Get all spots
router.get('/',async(req,res,next)=>{
    const spots = await Spot.findAll({
        include:{
                model: SpotImage,
                where: {'preview': true}
            }
    })
    let spotsList = []
    for(let spot of spots){
        let jspot = spot.toJSON()

        let avg = await Review.findAll({
            where: {'spotId': jspot.id},
            attributes: [[Sequelize.fn('AVG',Sequelize.col('stars')),'avgRating']]
        })
        console.log(avg[0].toJSON())
        jspot.avgRating = avg[0].toJSON().avgRating

        jspot.previewImage = jspot.SpotImages[0].url
        delete jspot.SpotImages
        spotsList.push(jspot)
    }
    res.json(spotsList)
})
// router.get('/',async(req,res,next)=>{
    //     const spots = await Spot.findAll({})
//     let spotsObj = {Spots: []}
//     for(let spot of spots){
//         let newSpot = {...spot}
//         const avg = await Review.findAll({
//             where:{
//                 spotId: spot.id,
//             },
//             attributes: [[Sequelize.fn('AVG',Sequelize.col('stars')),'avgRating']]
//         })
//         const url = await SpotImage.findOne({
    //             where:{
        //                 spotId: spot.id,
        //                 preview: true
//             },
//             attributes: ['url']
//         })
//         newSpot.dataValues.avgRating = avg[0].dataValues.avgRating
//         newSpot.dataValues.previewImage = url.dataValues.url

//         spotsObj.Spots.push(newSpot.dataValues)
//     }
//     res.json(spotsObj)
// })

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

// Get all Spots owned by the Current User
router.get('/myspots',async(req,res,next)=>{
    const spots = await Spot.findAll({
        where: {'ownerId': req.user.id},
        include:{
            model: SpotImage,
            where: {'preview': true}
        }
    })
    let spotsList = []
    for(let spot of spots){
        let jspot = spot.toJSON()

        let avg = await Review.findAll({
            where: {'spotId': jspot.id},
            attributes: [[Sequelize.fn('AVG',Sequelize.col('stars')),'avgRating']]
        })
        console.log(avg[0].toJSON())
        jspot.avgRating = avg[0].toJSON().avgRating

        jspot.previewImage = jspot.SpotImages[0].url
        delete jspot.SpotImages
        spotsList.push(jspot)
    }
    res.json(spotsList)
})


//get Spot by Id
router.get('/:spotId',async(req,res,next)=>{
    const spot = await Spot.findByPk(req.params.spotId,{
        include: [
            {
                model: Review,
                attributes:[]
            },
            {
                model: SpotImage,
            },
            {
                model: User,
                as: 'Owner',
            }
        ],
        attributes: {
            include: [
                [sequelize.fn('COUNT',sequelize.col('stars')), 'numReviews'],
                [sequelize.fn('AVG',sequelize.col('stars')), 'avgStarRating']
            ]
        },
    })
    // console.log(spot.toJSON())
    if(!spot){
        res.statusCode = 404
        res.json({messgae: "Spot couldn't be found",statusCode: 404})
    }
    //dsd/fds/fsf/dds/g//dsgfs/gfs/sfg/sf/hg/ghdg/ghs/
    res.json(spot)
})

// router.post('/',async(req,res,next)=>{

// })
module.exports = router;
