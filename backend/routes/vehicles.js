const express = require('express');
const router = express.Router();
const Vehicle = require('../models/Vehicle');
const Company = require('../models/Company');
const User = require('../models/User');
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
        const { brand, model, location, minPrice, maxPrice, companyId } = req.query;
        let query = {};
        if (brand) query.brand = new RegExp(brand, 'i');
        if (model) query.model = new RegExp(model, 'i');
        if (location) query.location = new RegExp(location, 'i');
        if (companyId) query.company = companyId;
        if (minPrice || maxPrice) {
            query.pricePerDay = {};
            if (minPrice) query.pricePerDay.$gte = parseInt(minPrice);
            if (maxPrice) query.pricePerDay.$lte = parseInt(maxPrice);
        }

        const vehicles = await Vehicle.find(query)
            .populate('owner', 'name email')
            .populate('company', 'companyName logo');
        res.json(vehicles);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   GET api/vehicles/my
// @desc    Get all vehicles listed by the logged-in user (owner or company)
router.get('/my', auth, async (req, res) => {
    try {
        const vehicles = await Vehicle.find({ owner: req.user.id })
            .populate('company', 'companyName logo');
        res.json(vehicles);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   POST api/vehicles
// @desc    List a new vehicle (Owner or Company)
router.post('/', auth, async (req, res) => {
    try {
        const { brand, model, year, pricePerDay, fuelType, transmission, description, location, images, availableFrom, availableTo } = req.body;

        // Validation for 5 mandatory images
        if (!images || !Array.isArray(images) || images.length !== 5) {
            return res.status(400).json({ msg: 'Exactly 5 images are mandatory.' });
        }

        // Auto-attach company if the lister is a company account
        let companyId = null;
        const lister = await User.findById(req.user.id).select('role');
        if (lister && lister.role === 'company') {
            const company = await Company.findOne({ user: req.user.id });
            if (company) companyId = company._id;
        }

        const newVehicle = new Vehicle({
            owner: req.user.id,
            brand, model, year, pricePerDay, fuelType, transmission, description, location, images, availableFrom, availableTo,
            company: companyId,
        });
        const vehicle = await newVehicle.save();
        res.json(vehicle);
    } catch (err) {
        console.error("Listing Crash Error:", err);
        res.status(500).json({ msg: err.message || 'Server Error' });
    }
});

// @route   DELETE api/vehicles/:id
// @desc    Delete a vehicle (owner/company must own it)
router.delete('/:id', auth, async (req, res) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id);
        if (!vehicle) return res.status(404).json({ msg: 'Vehicle not found' });
        if (vehicle.owner.toString() !== req.user.id)
            return res.status(401).json({ msg: 'Not authorized' });
        await vehicle.deleteOne();
        res.json({ msg: 'Vehicle removed' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;
