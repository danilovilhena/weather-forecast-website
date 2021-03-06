const path = require('path')
const express = require('express')
const hbs = require('hbs')

const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()
const port = process.env.PORT || 3000

//Define paths for Express config
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

//Setup handlebars engine and views location
app.set('views', viewsPath)
app.set('view engine', 'hbs')
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(path.join(__dirname, "../public")))


app.get("", (req, res) => {
    res.render("index", {
        title: "Weather",
        name: "Danilo Vilhena"
    })
})

app.get("/about", (req, res) => {
    res.render("about", {
        title: "About Me",
        name: "Danilo Vilhena"
    })
})

app.get("/help", (req, res) => {
    res.render("help", {
        title: 'Help',
        name: 'Danilo Vilhena',
    })
})

app.get("/weather", (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: "You must provide a valid address"
        })
    }
    address = req.query.address
    geocode(address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return res.send({ error })
        }
        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({ error })
            }
            res.send({
                forecast: forecastData,
                location,
                address
            })
        })
    })
})

app.get("/help/*", (req, res) => {
    res.render("404", {
        title: 404,
        name: 'Danilo Vilhena',
        errorMessage: 'Help article not found'
    })
})

app.get("*", (req, res) => {
    res.render("404", {
        title: 404,
        name: 'Danilo Vilhena',
        errorMessage: 'Page not found'
    })
})

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})