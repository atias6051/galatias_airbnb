const express = require('express')
const router = express.Router();

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User,Spot,SpotImage,Review, ReviewImage, sequelize, Sequelize } = require('../../db/models');

const authorize = async(req,res,next) =>{
    let spotImg = await SpotImage.findByPk(req.params.imageId,{attributes:['spotId']})
    spotImg = spotImg.toJSON()
    let spot = await Spot.findByPk(spotImg.spotId)
    spot = spot.toJSON()
    if(spot.ownerId == req.user.id) return next()
    res.statusCode = 403
    return res.json({
        message: "Forbidden",
        statusCode: 403
    })
}

const checkSpotImg = async(req,res,next) =>{
    const spotImg = await SpotImage.findByPk(req.params.imageId)
    if(spotImg) return next()
    res.statusCode = 404
    res.json({
        message: "Spot Image couldn't be found",
        statusCode: 404
    })
}
router.delete('/:imageId', requireAuth, checkSpotImg, authorize, async(req,res)=>{
    const spotImg = await SpotImage.findByPk(req.params.imageId)
    let jspotImg = spotImg.toJSON()
    if(jspotImg.preview == true){
        let prevSwitch = await SpotImage.findOne({where:{'preview': false}})
        if(prevSwitch){
            prevSwitch.preview = true
            await prevSwitch.save()
        }
    }
    await spotImg.destroy()

    res.json({message:"Successfully deleted",statusCode: 200})
})

router.put('/:imageId', requireAuth, checkSpotImg, authorize, async(req,res)=>{
    const spotImg = await SpotImage.findByPk(req.params.imageId)
    spotImg.url = req.body.url
    await spotImg.save()
    res.json(spotImg)
})

module.exports = router;
