// including required packages
const express = require('express')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const path = require('path')
const catchAsync = require('./utils/catchAsync')
const ExpressError = require('./utils/ExpressError')
// require models
const Campground = require('./models/campgrounds')
const joi = require('joi')
// port number to listen for requests
const port = 3000

// connect to MongoDB database
mongoose.connect('mongodb://localhost:27017/yelpcamp')

// check the status of database connection
const db = mongoose.connection
db.on("error", console.error.bind(console, "connection error"))
db.once("open", () => console.log("Database connected"))

// create an express application object
const app = express()

app.engine('ejs', ejsMate)
// set parameters for rendering templates
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
// middleware
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

const validateCampground = (req, res, next) => {
    const campgroundSchema = joi.object({
        title: joi.string().required(),
        price: joi.number().required().min(0),
        location: joi.string().required(),
        description: joi.string().required(),
        image: joi.string().required()
    }).required()
    const { error } = campgroundSchema.validate(req.body.campground)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        next(new ExpressError(msg, 400))
    }
    else next()
}

// RECEIVE REQUESTS
// main page
app.get('/', (req, res) => {
    res.render('home')
})
// campgrounds index
app.get('/campgrounds', catchAsync(async (req, res) => {
    const camps = await Campground.find({})
    res.render('campgrounds/index', { camps })
}))
// add new campgrounds
app.get('/campgrounds/new', (req, res) => res.render('new'))
// add new campground to server
app.post('/campgrounds', validateCampground, catchAsync(async (req, res, next) => {
    const cg = new Campground(req.body.campground)
    await cg.save()
    res.redirect(`/campgrounds/${cg._id}`)
}))
// show individual campground
app.get('/campgrounds/:id', catchAsync(async (req, res) => {
    const c = await Campground.findOne({ _id: req.params.id })
    res.render('campgrounds/show', { c })
}))
// render form to edit a campground
app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
    const cg = await Campground.findById(req.params.id)
    res.render('edit', { cg })
}))
// send put request to save changes
app.put('/campgrounds/:id',validateCampground, catchAsync(async (req, res) => {
    const { title, location } = req.body.campground
    await Campground.updateOne({ _id: req.params.id }, { title: title, location: location })
    res.redirect(`/campgrounds/${req.params.id}`)
}))
// delete campground
app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
    await Campground.findByIdAndDelete(req.params.id)
    res.redirect('/campgrounds')
}))


// if page unavailable
app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404))
})

// error handler
app.use((err, req, res, next) => {
    const { message = 'Something went wrong', statusCode = 500 } = err
    console.log(err)
    res.status(statusCode).render('error', { err })
})

// listen for incoming requests
app.listen(port, () => console.log(`LISTENING ON PORT ${port}`))