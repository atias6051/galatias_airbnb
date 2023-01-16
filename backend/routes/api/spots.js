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
    // const spot = await Spot.findByPk(req.params.spotId,{
    //     include: [
    //         {
    //             model: Review,
    //             attributes:[]
    //         },
    //         {
    //             model: SpotImage,
    //         },
    //         {
    //             model: User,
    //             as: 'Owner',
    //         }
    //     ],
    //     attributes: {
    //         include: [
    //             [sequelize.fn('COUNT',sequelize.col('stars')), 'numReviews'],
    //             [sequelize.fn('AVG',sequelize.col('stars')), 'avgStarRating']
    //         ]
    //     },
    // })

    let spot = await Spot.findByPk(req.params.spotId)
    //error
    if(!spot){
        res.statusCode = 404
        res.json({messgae: "Spot couldn't be found",statusCode: 404})
    }

    spot = spot.toJSON()

    let avg = await Review.findAll({
        where: {'spotId': spot.id},
        attributes: [
            [Sequelize.fn('COUNT',Sequelize.col('stars')),'numReviews'],
            [Sequelize.fn('AVG',Sequelize.col('stars')),'avgStarRating']
        ]
    })
    avg = avg[0].toJSON()
    spot.numReviews = avg.numReviews
    spot.avgStarRating = avg.avgStarRating

    let images = await SpotImage.findAll({where:{'spotId': spot.id}})
    let spotImages = []
    for(let img of images){
        spotImages.push(img.toJSON())
    }
    spot.SpotImages = spotImages

    let owner = await User.findOne({
        where:{'id': spot.ownerId},
        attributes: ['id','firstName','lastName']
    })
    spot.owner = owner.toJSON()


    res.json(spot)
})

// router.post('/',async(req,res,next)=>{

// })
module.exports = router;
