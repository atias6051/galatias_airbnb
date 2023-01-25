const express = require('express')
const router = express.Router();

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User,Spot,SpotImage,Review, ReviewImage, sequelize, Sequelize } = require('../../db/models');

module.exports = router;
