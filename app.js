// including required packages
const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
// port number to listen for requests
const port = 3000
// create an express application object
const app = express()


// set parameters for rendering templates
app.set('view engine','ejs')
app.set('views',path.join(__dirname,'/views'))

// receive get request for the main page
app.get('/',(req,res) => {
    res.render('home')
})

// listen for incoming requests
app.listen(port, () => {
    console.log(`LISTENING ON PORT ${port}`)
})