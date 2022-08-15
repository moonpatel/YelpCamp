// This file seeds test data obtained from cities.js and seedHelpers.js into the database 
// This file is not a part of the web application it is just for testing purposes

// including required packages
const mongoose = require('mongoose')

// require models
const Campground = require('../models/campgrounds')

// connect to MongoDB database
mongoose.connect('mongodb://localhost:27017/yelpcamp')

// check the status of database connection
const db = mongoose.connection
db.on("error", console.error.bind(console, "connection error"))
db.once("open", () => console.log("Database connected"))

const cities = require('./cities')
const {places,descriptors} = require('./seedHelpers')

const sample = data => data[Math.floor(Math.random()*data.length)]

const seedDB = async () => {
    await Campground.deleteMany({})     // delete all the data first

    for (let i = 0; i < 50; i++) {
        const randomNum = Math.floor(Math.random() *1000)
        // create an instance of a campground
        const cg = new Campground({
            location: `${cities[randomNum].city}, ${cities[randomNum].state}`,
            title: `${sample(descriptors)} ${sample(places)}`
        })
        // save it to database
        await cg.save()
    }
}

seedDB()
.then(() => mongoose.connection.close())
.catch(err => console.log('Error in seeding data',err))