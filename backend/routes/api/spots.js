const express = require('express')
const router = express.Router();
const {Op} = require('sequelize')

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User,Spot,SpotImage,Review,ReviewImage,Booking, sequelize, Sequelize } = require('../../db/models');
// const { multipleFilesUpload, multipleMulterUpload, retrievePrivateFile } = require("../../awsS3");
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const booking = require('../../db/models/booking');
const user = require('../../db/models/user');
const {generateUploadURL} = require('../../s3')


// const {
//   singleMulterUpload,
//   singlePublicFileUpload,
//   multipleMulterUpload,
//   multiplePublicFileUpload,
// } = require("../../awsS3");



const checkSpot = async(req,res,next)=>{
    let spot = await Spot.findByPk(req.params.spotId)
    if(!spot){
        res.statusCode = 404
        return res.json({message: "Spot couldn't be found",statusCode: 404})
    }
    return next()
}

const authorize = async(req,res,next) =>{
    let spot = await Spot.findByPk(req.params.spotId)
    if(!spot){
        res.statusCode = 404
        return res.json({message: "Spot couldn't be found",statusCode: 404})
    }

    if(spot.ownerId !== req.user.id){
        res.statusCode = 403
        return res.json({
            message: "Forbidden",
            statusCode: 403
        })
    }

    return next()
}

const validateBooking = async(req,res,next) =>{
    const {startDate,endDate} = req.body
    const validationErrorObj = {message: "Validation error",statusCode:400,errors:{}}
    let start = new Date(startDate).getTime()
    let end = new Date(endDate).getTime()

    //check if startDate before endDate
    if( end == start || end < start ){
        validationErrorObj.errors.endDate = "endDate cannot be on or before startDate"
        res.statusCode = 400
        return res.json(validationErrorObj)
    }

    const bookings = await Booking.findAll({
        where:{
            'spotId': req.params.spotId,
        }
    })

    validationErrorObj.message = "Sorry, this spot is already booked for the specified dates"
    validationErrorObj.statusCode = 403
    for(let book of bookings){
        let jbook = book.toJSON()
        bookStart = new Date(jbook.startDate).getTime()
        bookEnd = new Date(jbook.endDate).getTime()
        if(bookStart <= start && bookEnd >= start){
            res.statusCode = 403
            validationErrorObj.errors.startDate = "Start date conflicts with an existing booking"
            return res.json(validationErrorObj)
        }
        if(bookStart <= end && bookEnd >= end){
            res.statusCode = 403
            validationErrorObj.errors.endDate = "End date conflicts with an existing booking"
            return res.json(validationErrorObj)
        }
    }
    return next()

}

router.get('/s3url',requireAuth, async(req,res)=>{
    const url = await generateUploadURL()
    res.send({url})
})

router.get('/test/:spotId',requireAuth,checkSpot,validateBooking,(req,res)=>{
    res.json({message: "so far so good!"})
})

//Get all spots
router.get('/',async(req,res,next)=>{
    let {page,size} = req.query
    const validationErrorObj = {message:"Validation Error",statusCode:400,errors:{}}
    if(page == undefined || Number(page)>10) page = 1
    if(size == undefined || Number(size)>20) size = 20

    page = parseInt(page);
    size = parseInt(size);

    if(isNaN(page)|| page<1) validationErrorObj.errors.page = "Page must be greater than or equal to 1"
    if(isNaN(size)|| size<1) validationErrorObj.errors.size = "Size must be greater than or equal to 1"

    if(Object.keys(validationErrorObj.errors).length){
        res.statusCode = 400
        return res.json(validationErrorObj)
    }

    const pagination = {}

    if(page>= 1&& size>=1){
        pagination.limit = Number(size)
        pagination.offset = Number(size*(page-1))
    }
    const spots = await Spot.findAll({
        ...pagination
    })
    let spotsList = []
    for(let spot of spots){
        let jspot = spot.toJSON()

        let avg = await Review.findAll({
            where: {'spotId': jspot.id},
            attributes: [[Sequelize.fn('AVG',Sequelize.col('stars')),'avgRating']]
        })

        jspot.avgRating = parseFloat(parseFloat(avg[0].toJSON().avgRating).toFixed(1)) || 0

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
    const retObj = {Spots:spotsList}
    res.json(retObj)
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
    const retObj = {Spots:spotsList}
    res.json(retObj)
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
    spot.numReviews = parseInt(avg.numReviews) || 0
    spot.avgStarRating = parseFloat(parseFloat(avg.avgStarRating).toFixed(1)) || 0

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

//post new spot
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

//add spot image
router.post('/:spotId/images', requireAuth, authorize, async(req,res,next)=>{
    const {url, preview} = req.body
    if(!url) res.json({message: "Please provide image url",statusCode: 404})
    if(preview == true){
        let currPreview = await SpotImage.findOne({where:{
            'spotId': req.params.spotId,
            'preview': true
        }})
        if(currPreview) await currPreview.update({'preview': false})
    }
    await SpotImage.create({
        spotId: req.params.spotId,
        url: url,
        preview: preview
    })
    const spotImg = await SpotImage.findOne({where:{'url': url}})
    res.statusCode = 200
    res.json(spotImg)
})

//edit spot by id
router.put('/:spotId', requireAuth, authorize, async(req,res,next)=>{

    const {address,city,state,country,lat,lng,name,description,price} = req.body
    let spot = await Spot.findByPk(req.params.spotId)

    if(address) spot.address = address
    if(city) spot.city = city
    if(state) spot.state = state
    if(country) spot.country = country
    if(lat) spot.lat = lat
    if(lng) spot.lng = lng
    if(name) spot.name = name
    if(description) spot.description = description
    if(price) spot.price = price

    await spot.save()
    res.json(spot)
})

//delete spot
router.delete('/:spotId', requireAuth, authorize, async(req,res,next)=>{
    let spot = await Spot.findByPk(req.params.spotId)
    await spot.destroy()
    res.statusCode = 200
    res.json({message: "Successfully deleted", statusCode: res.statusCode})
})

//Get all Reviews by a Spot's id
router.get('/:spotId/reviews', checkSpot, async(req,res,next)=>{
    let reviews = await Review.findAll({where: {'spotId':req.params.spotId}})
    let retObject = {Reviews:[]}
    for(let rev of reviews){
        let jrev = rev.toJSON()

        let user = await User.findByPk(jrev.userId,{attributes:['id','firstName','lastName']})
        jrev.User = user.toJSON()

        let revImgs = await ReviewImage.findAll({where:{'reviewId': jrev.id},attributes:['id','url']})
        jrev.ReviewImages = []
        for(let ri of revImgs){
            jrev.ReviewImages.push(ri)
        }

        retObject.Reviews.push(jrev)
    }
    res.json(retObject)
})

//Create a Review for a Spot based on the Spot's id
router.post('/:spotId/reviews', requireAuth, checkSpot, async(req,res,next)=>{
    const {review, stars} = req.body

    let checkRev = await Review.findOne({where:{'userId': req.user.id,'spotId':req.params.spotId}})
    if(checkRev){
        res.statusCode = 403
        res.json({message: "User already has a review for this spot", statusCode: 403})
    }

    const validationError = {message:'Validation error',statusCode: 400,errors:{}}
    if(!review) validationError.errors.review = "Review text is required"
    if(!stars || isNaN(stars) || stars<1 || stars>5) validationError.errors.stars = "Stars must be an integer from 1 to 5"
    if(validationError.errors.review || validationError.errors.stars){
        res.statusCode = 400
        res.json(validationError)
    }

    const newReview = await Review.create({
        userId:req.user.id,
        spotId: req.params.spotId,
        review: review,
        stars: stars
    })

    const revCheck = await Review.findOne({where:{'userId': req.user.id,'spotId':req.params.spotId}})
    res.statusCode = 201
    res.json(revCheck)
})

//Get all Bookings for a Spot based on the Spot's id
router.get('/:spotId/bookings', requireAuth, checkSpot, async(req,res)=>{
    const retObj = {Bookings: []}
    let spot = await Spot.findByPk(req.params.spotId)
    spot = spot.toJSON()
    let isOwner = req.user.id == spot.ownerId
    const bookings = await Booking.findAll({where:{'spotId': req.params.spotId}})
    for(let book of bookings){
        let jbook = book.toJSON()
        let orderedObj = {}
        if(isOwner){
            let user = await User.findByPk(jbook.userId,{attributes:['id','firstName','lastName']})
            // orderedObj.User = user
            orderedObj = {User:user,...jbook}
        }else{
            orderedObj = {spotId: jbook.spotId, startDate: jbook.startDate, endDate: jbook.endDate}
        }
        retObj.Bookings.push(orderedObj)
    }
    res.json(retObj)
})
//Create a Booking from a Spot based on the Spot's id
router.post('/:spotId/bookings', requireAuth, checkSpot, validateBooking, async(req,res)=>{
    const {startDate,endDate} = req.body
    await Booking.create({
        spotId: req.params.spotId,
        userId: req.user.id,
        startDate: startDate,
        endDate: endDate
    })
    const booking = await Booking.findOne({where:{
        'spotId':req.params.spotId,
        'userId':req.user.id,
        "startDate":startDate
    }})
    res.json(booking)
})


// router.post('/uploadTest',multipleMulterUpload("images"), async(req,res)=>{
    //     // const keys = await multipleFilesUpload({ files: req.files });
    //     const files = req.files
    //     console.log(files)
    //     res.send("Hello!")
    // })




// router.post('/uploadTest', singleMulterUpload("image"), async(req,res)=>{
// // router.post('/uploadTest', async(req,res)=>{
//     console.log("WE ARE HERE")
//     // const profileImageUrl = await singlePublicFileUpload(req.file);
//     // const file = req.file
//     // console.log("FILE______", file)
//     // console.log(file)
//     // console.log("res from s3--->",profileImageUrl)
//     res.send("Hello2!")
// })



module.exports = router;
