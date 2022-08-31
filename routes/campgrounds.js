const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const { campgroundSchema } = require('../schemas')


const ExpressError = require('../utils/ExpressError')
const Campground = require('../models/campgrounds')

// validate campground object
const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body.campground)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }
    else next()
}

// campgrounds index
router.get('/', catchAsync(async (req, res) => {
    const camps = await Campground.find({})
    res.render('campgrounds/index', { camps })
}))
// add new campgrounds
router.get('/new', (req, res) => res.render('new'))
// add new campground to server
router.post('/', validateCampground, catchAsync(async (req, res, next) => {
    const cg = new Campground(req.body.campground)
    await cg.save()
    res.redirect(`/campgrounds/${cg._id}`)
}))

// show individual campground
router.get('/:id', catchAsync(async (req, res) => {
    const c = await Campground.findOne({ _id: req.params.id }).populate('reviews')
    res.render('campgrounds/show', { c })
}))
// render form to edit a campground
router.get('/:id/edit', catchAsync(async (req, res) => {
    const cg = await Campground.findById(req.params.id)
    res.render('edit', { cg })
}))
// send put request to save changes
router.put('/:id', validateCampground, catchAsync(async (req, res) => {
    const { title, location } = req.body.campground
    await Campground.updateOne({ _id: req.params.id }, { title: title, location: location })
    res.redirect(`/campgrounds/${req.params.id}`)
}))
// delete campground
router.delete('/:id', catchAsync(async (req, res) => {
    await Campground.findByIdAndDelete(req.params.id)
    res.redirect('/campgrounds')
}))

module.exports = router