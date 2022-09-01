const express = require('express')
const router = express.Router()
const flash = require('connect-flash')
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
    req.flash('success', `Successfully made a new campground - ${cg.title}`)
    res.redirect(`/campgrounds/${cg._id}`)
}))

// show individual campground
router.get('/:id', catchAsync(async (req, res) => {
    const c = await Campground.findOne({ _id: req.params.id }).populate('reviews')
    if (!c) {
        req.flash('error', 'Cannot find that campground')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { c })
}))
// render form to edit a campground
router.get('/:id/edit', catchAsync(async (req, res) => {
    const cg = await Campground.findById(req.params.id)
    if (!cg) {
        req.flash('error', 'Cannot find that campground')
        return res.redirect('/campgrounds')
    }
    res.render('edit', { cg })
}))
// send put request to save changes
router.put('/:id', validateCampground, catchAsync(async (req, res) => {
    const { title, location } = req.body.campground
    await Campground.updateOne({ _id: req.params.id }, { title: title, location: location })
    req.flash('success', `Successfully updated ${title}`)
    res.redirect(`/campgrounds/${req.params.id}`)
}))
// delete campground
router.delete('/:id', catchAsync(async (req, res) => {
    const campground = await Campground.findByIdAndDelete(req.params.id)
    req.flash('success', `Successfully deleted ${campground.title}`)
    res.redirect('/campgrounds')
}))

module.exports = router