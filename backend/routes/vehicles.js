const express = require('express');
const router = express.Router();
const Vehicle = require('../models/Vehicle');
const jwt = require('jsonwebtoken');

// Middleware to verify JWT
const auth = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

// @route   GET api/vehicles
// @desc    Get all vehicles with filters
router.get('/', async (req, res) => {
    try {
        const { brand, model, location, minPrice, maxPrice } = req.query;
        let query = {};
        if (brand) query.brand = new RegExp(brand, 'i');
        if (model) query.model = new RegExp(model, 'i');
        if (location) query.location = new RegExp(location, 'i');
        if (minPrice || maxPrice) {
            query.pricePerDay = {};
            if (minPrice) query.pricePerDay.$gte = parseInt(minPrice);
            if (maxPrice) query.pricePerDay.$lte = parseInt(maxPrice);
        }

        const vehicles = await Vehicle.find(query).populate('owner', 'name email');
        res.json(vehicles);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   POST api/vehicles
// @desc    List a new vehicle (Owner only)
router.post('/', auth, async (req, res) => {
    try {
        const { brand, model, year, pricePerDay, fuelType, transmission, description, location, images, availableFrom, availableTo } = req.body;
        
        // Validation for 5 mandatory images
        if (!images || !Array.isArray(images) || images.length !== 5) {
            return res.status(400).json({ msg: 'Exactly 5 images are mandatory.' });
        }

        const newVehicle = new Vehicle({
            owner: req.user.id,
            brand, model, year, pricePerDay, fuelType, transmission, description, location, images, availableFrom, availableTo
        });
        const vehicle = await newVehicle.save();
        res.json(vehicle);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;
