// including required packages
const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
// require models
const Campground = require('./models/campgrounds')
// port number to listen for requests
const port = 3000

// connect to MongoDB database
mongoose.connect('mongodb://localhost:27017/yelpcamp', {
})

// check the status of database connection
// const db = mongoose.connection
// db.on("error", console.error.bind(console,"connection error"))
// db.once("open", () => {
//     console.log("Database connected")
// })





const cities = require('./seeds/cities')
const {places,descriptors} = require('./seeds/seedHelpers')

const sample = data => data[Math.floor(Math.random()*data.length)]

const seedDB = async () => {
    await Campground.deleteMany({})     // delete all the data first

    for (let i = 0; i < 50; i++) {
        const city = sample(cities)
        const desc = `${sample(descriptors)} ${sample(places)}}`
        const cg = new Campground({
            title: desc,
            location: `${city.city, city.state}`
        })
        console.log(desc,`${city.city, city.state}`)
        await cg.save()
    }
}

seedDB()
.then(() => {
    console.log('Data added')
    mongoose.connection.close();
})
.catch((err) => {
    console.log('Error in seeding data',err)
})






// // create an express application object
// const app = express()

// // set parameters for rendering templates
// app.set('view engine','ejs')
// app.set('views',path.join(__dirname,'views/'))

// // RECEIVE REQUESTS
// // main page
// app.get('/',(req,res) => {
//     res.render('home')
// })

// // campgrounds
// app.get('/campgrounds',(req,res) => {
//     const camp = new Campground({title:'Backyard'})
//     res.send(camp)
// })

// // listen for incoming requests
// app.listen(port, () => {
//     console.log(`LISTENING ON PORT ${port}`)
// })