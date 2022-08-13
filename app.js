// including required packages
const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
// require models
const Campground = require('./models/campgrounds')
// port number to listen for requests
const port = 3000

// connect to MongoDB database
mongoose.connect('mongodb://localhost:27017/yelpcamp')

// check the status of database connection
const db = mongoose.connection
db.on("error", console.error.bind(console,"connection error"))
db.once("open", () => {
    console.log("Database connected")
})

// create an express application object
const app = express()

// set parameters for rendering templates
app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views/'))

// RECEIVE REQUESTS
// main page
app.get('/',(req,res) => {
    res.render('home')
})

// campgrounds
app.get('/campgrounds',(req,res) => {
    const camp = new Campground({title:'Backyard'})
    res.send(camp)
})

// listen for incoming requests
app.listen(port, () => {
    console.log(`LISTENING ON PORT ${port}`)
})