const joi = require('joi')

const campgroundSchema = joi.object({
    title: joi.string().required(),
    price: joi.number().required().min(0),
    location: joi.string().required(),
    description: joi.string().required(),
    image: joi.string().required()
}).required()
module.exports.campgroundSchema = campgroundSchema

const reviewSchema = joi.object({
    body: joi.string().required(),
    rating: joi.number().required().min(0).max(5)
}).required()
module.exports.reviewSchema = reviewSchema