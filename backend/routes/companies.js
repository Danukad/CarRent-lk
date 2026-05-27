const express = require('express');
const router = express.Router();
const Company = require('../models/Company');
const Vehicle = require('../models/Vehicle');
const jwt = require('jsonwebtoken');

// Auth middleware
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

// @route   GET /api/companies
// @desc    Get all companies with vehicle counts (public)
router.get('/', async (req, res) => {
    try {
        const { search } = req.query;
        let query = { isVerified: true };
        if (search) query.companyName = new RegExp(search, 'i');

        const companies = await Company.find(query)
            .populate('user', 'name email')
            .sort({ createdAt: -1 });

        // Attach vehicle count per company
        const result = await Promise.all(
            companies.map(async (c) => {
                const vehicleCount = await Vehicle.countDocuments({ company: c._id });
                return { ...c.toObject(), vehicleCount };
            })
        );
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/companies/me
// @desc    Get logged-in company's profile (company auth required)
router.get('/me', auth, async (req, res) => {
    try {
        const company = await Company.findOne({ user: req.user.id }).populate('user', 'name email');
        if (!company) return res.status(404).json({ msg: 'Company profile not found' });
        res.json(company);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/companies/me
// @desc    Update logged-in company's profile (company auth required)
router.put('/me', auth, async (req, res) => {
    try {
        const { companyName, logo, description, phone, address, contactEmail } = req.body;
        const company = await Company.findOneAndUpdate(
            { user: req.user.id },
            { companyName, logo, description, phone, address, contactEmail },
            { new: true }
        );
        if (!company) return res.status(404).json({ msg: 'Company not found' });
        res.json(company);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/companies/:id
// @desc    Get a single company profile + their vehicles (public)
router.get('/:id', async (req, res) => {
    try {
        const company = await Company.findById(req.params.id).populate('user', 'name email');
        if (!company) return res.status(404).json({ msg: 'Company not found' });

        const vehicles = await Vehicle.find({ company: company._id });
        res.json({ ...company.toObject(), vehicles });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
