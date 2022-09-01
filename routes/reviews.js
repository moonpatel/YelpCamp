const express = require('express')
const router = express.Router({ mergeParams: true })
const catchAsync = require('../utils/catchAsync')
const { reviewSchema } = require('../schemas')


const ExpressError = require('../utils/ExpressError')
const Campground = require('../models/campgrounds')
const Review = require('../models/reviews')


// validate reviews object
const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body.review)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }
    else next()
}

// add review to server
router.post('/', validateReview, catchAsync(async (req, res) => {
    console.log(req.params.id)
    const campground = await Campground.findById(req.params.id)
    console.log(campground)
    const review = new Review(req.body.review)
    campground.reviews.push(review)
    await campground.save()
    await review.save()
    req.flash('success','Successfully created new review')
    res.redirect(`/campgrounds/${req.params.id}`)
}))
// delete review
router.delete('/:reviewId', catchAsync(async (req, res, next) => {
    const { id, reviewId } = req.params
    await Review.findByIdAndDelete(reviewId)
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    req.flash('success','Successfully deleted review')
    res.redirect(`/campgrounds/${id}`)
}))

module.exports = router