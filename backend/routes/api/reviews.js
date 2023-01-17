const express = require('express')
const router = express.Router();

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User,Spot,SpotImage,Review, ReviewImage, sequelize, Sequelize } = require('../../db/models');

router.get('/current', requireAuth, async(req,res,next)=>{
    const userId = req.user.id
    let reviews = await Review.findAll({where:{'userId': userId}})
    // console.log(reviews[0].toJSON())
    const resObject = {Reviews: []}
    for(let rev of reviews){
        let jrev = rev.toJSON()

        let user = await User.findByPk(jrev.userId,{attributes: ['id','firstName','lastName']})
        user = user.toJSON()

        let spot = await Spot.findByPk(jrev.spotId, {attributes:{exclude:['description','createdAt','updatedAt']}})
        spot = spot.toJSON()

        let image = await SpotImage.findOne({where:{'spotId': spot.id, 'preview': true}})
        image = image.toJSON()
        spot.previewImage = image.url

        let ReviewImages = []
        let revImg = await ReviewImage.findAll({where: {'reviewId': jrev.id}})
        for(let img of revImg){
            img = img.toJSON()
            ReviewImages.push({id: img.id, url: img.url})
        }

        const revObj = {...jrev,user: user,spot: spot,ReviewImages: ReviewImages}
        resObject.Reviews.push(revObj)
    }
    res.json(resObject)
})


module.exports = router;
