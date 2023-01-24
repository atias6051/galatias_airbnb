const express = require('express')
const router = express.Router();

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User,Spot,SpotImage,Review, sequelize, Sequelize } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

//Get all spots
router.get('/',async(req,res,next)=>{
    const spots = await Spot.findAll()
    let spotsList = []
    for(let spot of spots){
        let jspot = spot.toJSON()

        let avg = await Review.findAll({
            where: {'spotId': jspot.id},
            attributes: [[Sequelize.fn('AVG',Sequelize.col('stars')),'avgRating']]
        })
        jspot.avgRating = avg[0].toJSON().avgRating || 0

        let previewImage = await SpotImage.findOne({
            where:{
                'spotId':jspot.id,
                'preview': true
            }
        })
        if(previewImage){
            previewImage = previewImage.toJSON()
            jspot.previewImage = previewImage.url
        }

        spotsList.push(jspot)
    }
    res.json(spotsList)
})


// Get all Spots owned by the Current User
router.get('/current', requireAuth, async(req,res,next)=>{
    const spots = await Spot.findAll({
        where: {'ownerId': req.user.id}
    })
    if(!spots.length){
        res.statusCode = 404
        res.json({message: "You owen no Spots"})
    }

    let spotsList = []
    for(let spot of spots){
        let jspot = spot.toJSON()

        let avg = await Review.findAll({
            where: {'spotId': jspot.id},
            attributes: [[Sequelize.fn('AVG',Sequelize.col('stars')),'avgRating']]
        })
        console.log(avg[0].toJSON())
        jspot.avgRating = avg[0].toJSON().avgRating || 0

        let previewImage = await SpotImage.findOne({
            where:{
                'spotId':jspot.id,
                'preview': true
            }
        })
        if(previewImage){
            previewImage = previewImage.toJSON()
            jspot.previewImage = previewImage.url
        }

        spotsList.push(jspot)
    }
    res.json(spotsList)
})


//get Spot by Id
router.get('/:spotId',async(req,res,next)=>{

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

router.post('/',requireAuth ,async(req,res,next)=>{
    const errors = []
    const ownerId = req.user.id
    const {address,city,state,country,lat,lng,name,description,price} = req.body

    if(!address) errors.push("Street address is required")
    if(!city) errors.push("City is required")
    if(!state) errors.push('State is required')
    if(!country) errors.push('Country is required')
    if(!lat) errors.push('Latitude is not valid')
    if(!lng) errors.push('Longitude is not valid')
    if(!name) errors.push('Name is required')
    if(name && name.length>=50) errors.push('Name must be less than 50 characters')
    if(!description) errors.push('Description is required')
    if(!price) errors.push('Price per day is required')

    if(errors.length){
        res.statusCode = 400
        res.json({
            message: "Validation Error",
            status: res.statusCode,
            errors: errors
        })
    }

    const newsSpot = await Spot.create({
        ownerId: ownerId,
        ...req.body
    })
    await newsSpot.save()
    const returnSpot = await Spot.findOne({where: {'name': name}})
    res.statusCode = 201
    res.json(returnSpot)
})

module.exports = router;
