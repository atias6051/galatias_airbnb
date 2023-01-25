const express = require('express')
const router = express.Router();

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User,Spot,SpotImage,Review,Booking, ReviewImage, sequelize, Sequelize } = require('../../db/models');

router.get('/current', requireAuth,async(req,res)=>{
    const bookings = await Booking.findAll({wehre:{'userId': req.user.id}})
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

module.exports = router;
