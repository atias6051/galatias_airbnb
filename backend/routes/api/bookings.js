const express = require('express')
const router = express.Router();

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User,Spot,SpotImage,Review,Booking, ReviewImage, sequelize, Sequelize } = require('../../db/models');
const {Op} = require('sequelize')
const checkBooking = async(req,res,next) =>{
    const booking = await Booking.findByPk(req.params.bookingId)
    if(booking) return next()
    res.statusCode = 404
    res.json({message:"Booking couldn't be found",statusCode: 404})
}

const authorizeUserOrOwner = async(req,res,next) => {
    const booking = await Booking.findByPk(req.params.bookingId)
    const spot = await Spot.findByPk(booking.spotId)
    if(booking.userId == req.user.id || spot.ownerId == req.user.Id) return next()
    res.statusCode = 403
    return res.json({
        message: "Forbidden",
        statusCode: 403
    })
}
const authorizeUser = async(req,res,next) => {
    const booking = await Booking.findByPk(req.params.bookingId)
    // const spot = await Spot.findByPk(booking.spotId)
    if(booking.userId == req.user.id) return next()
    res.statusCode = 403
    return res.json({
        message: "Forbidden",
        statusCode: 403
    })
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
        res.json(validationErrorObj)
    }

    let booking = await Booking.findByPk(req.params.bookingId)
    let today = new Date().getTime()
    let bookEnd = new Date(booking.endDate).getTime()
    if(bookEnd < today){
        res.statusCode = 403
        res.json({message: "Past bookings can't be modified",statusCode: 403})
    }

    const bookings = await Booking.findAll({
        where:{
            'spotId': booking.spotId,
            [Op.not]:{'id': req.params.bookingId}
        }
    })


    validationErrorObj.message = "Sorry, this spot is already booked for the specified dates"
    validationErrorObj.statusCode = 403
    for(let book of bookings){
        let jbook = book.toJSON()
        bookStart = new Date(jbook.startDate).getTime()
        bookEnd = new Date(jbook.endDate).getTime()
        if(bookStart <= start && bookEnd >= start && jbook.id !== req.params.bookingId){
            res.statusCode = 403
            validationErrorObj.errors.startDate = "Start date conflicts with an existing booking"
            res.json(validationErrorObj)
        }
        if(bookStart <= end && bookEnd >= end && jbook.id !== req.params.bookingId){
            console.log(jbook.id)
            res.statusCode = 403
            validationErrorObj.errors.endDate = "End date conflicts with an existing booking"
            res.json(validationErrorObj)
        }
    }

    return next()

}



router.get('/current', requireAuth,async(req,res)=>{
    const bookings = await Booking.findAll({where:{'userId': req.user.id}})
    const retObj = {Bookings:[]}
    for(let book of bookings){
        let jbook = book.toJSON()
        let spot = await Spot.findByPk(jbook.spotId,{attributes:{exclude:['createdAt','updatedAt','description']}})
        spot = spot.toJSON()
        let spotImg = await SpotImage.findOne({where:{'spotId':spot.id,'preview':true}})
        if(spotImg) spot.previewImage = spotImg.url
        const orderedBooking = {
            id: jbook.id,
            spotId: spot.id,
            Spot: spot,
            userId: jbook.userId,
            startDate: jbook.startDate,
            endDate: jbook.endDate,
            createdAt: jbook.createdAt,
            updatedAt: jbook.updatedAt
        }
        retObj.Bookings.push(orderedBooking)
    }

    res.json(retObj)

})

router.delete('/:bookingId', requireAuth, checkBooking, authorizeUserOrOwner, async(req,res)=>{
    const booking = await Booking.findByPk(req.params.bookingId)
    await booking.destroy()
    res.json({
        message: "Successfully deleted",
        statusCode: 200
      })
})
router.put('/:bookingId', requireAuth, checkBooking, authorizeUser, validateBooking, async(req,res)=>{
    const booking = await Booking.findByPk(req.params.bookingId)
    const {startDate,endDate} = req.body
    booking.startDate = startDate
    booking.endDate = endDate
    await booking.save()
    const updatedBooking = await Booking.findByPk(req.params.bookingId)
    // res.json("We are good!")
    res.json(updatedBooking)
})

router.get('/all',async(req,res)=>{
    const bookings = await Booking.findAll()
    res.json(bookings)
})

module.exports = router;
