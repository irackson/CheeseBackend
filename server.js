///////////////////////////////
// DEPENDENCIES
////////////////////////////////
// get .env variables
require('dotenv').config();
const cors = require('cors');
const morgan = require('morgan');

// pull PORT from .env, give default value of 3000
const { PORT = 3000, MONGODB_URL } = process.env;
// import express
const express = require('express');
// create application object
const app = express();

///////////////////////////////
// DATABASE CONNECTION
////////////////////////////////
// Establish Connection
const mongoose = require('mongoose');
mongoose.connect(MONGODB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});
// Connection Events
mongoose.connection
    .on('open', () => console.log('You are connected to Mongo'))
    .on('close', () => console.log('You are disconnected from mongo'))
    .on('error', (error) => console.log(error));

///////////////////////////////
// MODELS
////////////////////////////////
const CheeseSchema = new mongoose.Schema({
    name: String,
    countryOfOrigin: String,
    image: String,
});

const Cheese = mongoose.model('Cheese', CheeseSchema);

///////////////////////////////
// MIDDLEWARE
////////////////////////////////
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
///////////////////////////////
// ROUTES
////////////////////////////////
// create a test route
app.get('/', (req, res) => {
    res.send('hello world');
});

// CHEESE INDEX ROUTE - DISPLAYS ALL CHEESE
app.get('/cheese', async (req, res) => {
    try {
        res.json(await Cheese.find({}));
    } catch (error) {
        res.status(400).json(error);
    }
});

// Cheese Create Route
app.post('/cheese', async (req, res) => {
    try {
        console.log(req.body);
        const newPerson = await Cheese.create(req.body);
        res.json(newPerson);
    } catch (error) {
        res.status(400).json(error);
    }
});

// Cheese Update Route
app.put('/cheese/:id', async (req, res) => {
    try {
        res.json(
            await Cheese.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
            })
        );
    } catch (error) {
        res.status(400).json(error);
    }
});

// Cheese Delete Route
app.delete('/cheese/:id', async (req, res) => {
    try {
        res.json(await Cheese.findByIdAndRemove(req.params.id));
    } catch (error) {
        res.status(400).json(error);
    }
});

///////////////////////////////
// LISTENER
////////////////////////////////
app.listen(PORT, () => console.log(`listening on PORT ${PORT}`));
