const express = require('express')
const router = express.Router();

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User,Spot,SpotImage,Review, ReviewImage, sequelize, Sequelize } = require('../../db/models');

const authorize = async(req,res,next) =>{
    let reviewImg = await ReviewImage.findByPk(req.params.imageId,{attributes:['reviewId']})
    reviewImg = reviewImg.toJSON()
    let review = await Review.findByPk(reviewImg.reviewId)
    review = review.toJSON()
    if(review.userId == req.user.id) return next()
    res.statusCode = 403
    return res.json({
        message: "Forbidden",
        statusCode: 403
    })
}

const checkReviewImg = async(req,res,next) =>{
    const reviewImg = await ReviewImage.findByPk(req.params.imageId)
    if(reviewImg) return next()
    res.statusCode = 404
    res.json({
        message: "Spot Image couldn't be found",
        statusCode: 404
    })
}

//Delete a Review Image
router.delete('/:imageId', requireAuth, checkReviewImg, authorize, async(req,res)=>{
    const reviewImg = await ReviewImage.findByPk(req.params.imageId)
    await reviewImg.destroy()
    res.json({message:"Successfully deleted",statusCode: 200})
})

module.exports = router;
