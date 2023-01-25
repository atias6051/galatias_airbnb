const express = require('express')
const router = express.Router();

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User,Spot,SpotImage,Review, ReviewImage, sequelize, Sequelize } = require('../../db/models');

const checkReview = async (req,res,next) =>{
    const review = await Review.findByPk(req.params.reviewId)
    if(review) return next()
    res.statusCode = 404
    res.json({message: "Review couldn't be found",statusCode:404})
}
const authorize = async (req,res,next) =>{
    const review = await Review.findByPk(req.params.reviewId)
    // if(spot.ownerId !== req.user.id)
    if(review.userId == req.user.id) return next()
    res.statusCode = 403
    return res.json({
        message: "Forbidden",
        statusCode: 403
    })
}
//Get all Reviews of the Current User
router.get('/current', requireAuth, async(req,res,next)=>{
    const userId = req.user.id
    let reviews = await Review.findAll({where:{'userId': userId}})
    const resObject = {Reviews: []}
    for(let rev of reviews){
        let jrev = rev.toJSON()
        console.log('jrev')
        let user = await User.findByPk(jrev.userId,{attributes: ['id','firstName','lastName']})
        user = user.toJSON()

        let spot = await Spot.findByPk(jrev.spotId, {attributes:{exclude:['description','createdAt','updatedAt']}})
        spot = spot.toJSON()

        let image = await SpotImage.findOne({where:{'spotId': spot.id, 'preview': true}})
        if(image){
            image = image.toJSON()
            spot.previewImage = image.url
        }

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

// Add an Image to a Review based on the Review's id
router.post('/:reviewId/images', requireAuth, checkReview, authorize,async(req,res)=>{
    const imgCount = await ReviewImage.findAll({
        where:{'reviewId': req.params.reviewId},
        attributes: [[sequelize.fn('COUNT',sequelize.col('url')),'numImages']]
    })

    if(imgCount[0].toJSON().numImages == 10){
        res.statusCode = 403
        res.json({message:"Maximum number of images for this resource was reached",statusCode:403})
    }

    const {url} = req.body
    if(!url) res.json({message:"Please provide image url"})
    await ReviewImage.create({
        reviewId: req.params.reviewId,
        url: url
    })
    const newReviewImage = await ReviewImage.findOne({
        where:{
            'reviewId': req.params.reviewId,
            'url': url
        },
        attributes: ['id','url']
    })
    res.json(newReviewImage)
})


module.exports = router;
