const aws = require('aws-sdk')
const crypto = require('crypto')
const { promisify } = require('util')
require("dotenv").config();
// import aws from 'aws-sdk'
// import crypto from 'crypto'
// import { promisify } from 'util'

const randomBytes = promisify(crypto.randomBytes)

const bucketName = process.env.AWS_BUCKET_NAME
const region = process.env.AWS_BUCKET_REGION
const accessKeyId = process.env.AWS_ACCESS_KEY_ID
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY

const s3 = new aws.S3({
    region,
    accessKeyId,
    secretAccessKey,
    signatureVersion: 'v4'
})

async function generateUploadURL(){
    const rawBytes = await randomBytes(16)
    const imageName = rawBytes.toString('hex')
    const params = ({
        Bucket:bucketName,
        Key:imageName,
        Expires:60
    })

    const uploadURL = await s3.getSignedUrlPromise('putObject', params)
    // console.log(uploadURL)
    return uploadURL
}

module.exports = {generateUploadURL}
