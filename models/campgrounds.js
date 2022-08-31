// include mongoose
const mongoose = require('mongoose')
const Schema = mongoose.Schema

// schema for campgrounds
const campgroundSchema = new Schema({
    title: String,
    location: String,
    description: String,
    price: Number,
    image: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
})

// create a model out of campgroundSchema
module.exports = mongoose.model('Campground',campgroundSchema)