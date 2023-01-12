// Add usefull libraries
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');
const path = require('path');
const rateLimit = require('express-rate-limit')
const helmet = require('helmet');
const username = encodeURIComponent("<username>");
const password = encodeURIComponent("<password>");
require('dotenv').config();
const dataBaseAccess = process.env.MONGO_ACCESS;

// Define express rate limiter params
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

// Connexion test to data base
mongoose.connect(dataBaseAccess,
    { useNewUrlParser: true,
      useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(express.json());

// Prevent from CORS error
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// Apply the rate limiting middleware to all requests
app.use(limiter)

// Add security config to HTTP headers
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

// Routes
app.use("/api/auth", userRoutes);
app.use("/api/sauces", sauceRoutes);

// Images management
// Allow to load files stacked in "images" repository
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;