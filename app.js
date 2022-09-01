// including required packages
const express = require('express')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const session = require('express-session')
const flash = require('connect-flash')

const path = require('path')
const ExpressError = require('./utils/ExpressError')

// routes
const campground = require('./routes/campgrounds')
const reviews = require('./routes/reviews')
// port number to listen for requests
const port = 3000

// connect to MongoDB database
mongoose.connect('mongodb://localhost:27017/yelpcamp')

// check the status of database connection
const db = mongoose.connection
db.on("error", console.error.bind(console, "connection error"))
db.once("open", () => console.log("Connected to MongoDB"))

// create an express application object
const app = express()

app.engine('ejs', ejsMate)
// set parameters for rendering templates
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
// middleware
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))
const sessionConfig = {
    secret: 'thisisnotagoodsecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash())
app.use((req,res,next) => {
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})

// RECEIVE REQUESTS
// main page
app.get('/', (req, res) => res.render('home'))
// campground routes
app.use('/campgrounds', campground)
// review routes
app.use('/campgrounds/:id/reviews', reviews)


// Page not found
app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404))
})
// all in one error handler
app.use((err, req, res, next) => {
    const { message = 'Something went wrong', statusCode = 500 } = err
    console.log(err)
    res.status(statusCode).render('error', { err })
})

// listen for incoming requests
app.listen(port, () => console.log(`LISTENING ON PORT ${port}`))