// including required packages
const express = require('express')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const path = require('path')
// require models
const Campground = require('./models/campgrounds')
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



// RECEIVE REQUESTS
// main page
app.get('/', (req, res) => {
    res.render('home')
})
// campgrounds index
app.get('/campgrounds', async (req, res) => {
    const camps = await Campground.find({})
    res.render('campgrounds/index', { camps })
})
// add new campgrounds
app.get('/campgrounds/new', (req, res) => res.render('new'))
// add new campground to server
app.post('/campgrounds', async (req, res) => {
    const cg = new Campground(req.body.campground)
    await cg.save()
    res.redirect(`/campgrounds/${cg._id}`)
})
// show individual campground
app.get('/campgrounds/:id', async (req, res) => {
    const c = await Campground.findOne({ _id: req.params.id })
    console.log(c, req.params.id)
    res.render('campgrounds/show', { c })
})
// render form to edit a campground
app.get('/campgrounds/:id/edit', async (req, res) => {
    const cg = await Campground.findById(req.params.id)
    res.render('edit', { cg })
})
// send put request to save changes
app.put('/campgrounds/:id', async (req, res) => {
    const { title, location } = req.body.campground
    await Campground.updateOne({ _id: req.params.id }, { title: title, location: location })
    res.redirect(`/campgrounds/${req.params.id}`)
})
// delete campground
app.delete('/campgrounds/:id', async (req, res) => {
    await Campground.findByIdAndDelete(req.params.id)
    res.redirect('/campgrounds')
})



// listen for incoming requests
app.listen(port, () => console.log(`LISTENING ON PORT ${port}`))