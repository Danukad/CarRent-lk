const mongoose = require('mongoose');

const VehicleSchema = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    brand: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    pricePerDay: { type: Number, required: true },
    fuelType: { type: String },
    transmission: { type: String },
    description: { type: String },
    location: { type: String, required: true },
    images: [{ type: String }], // URLs to images
    availableFrom: { type: Date, required: true },
    availableTo: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Vehicle', VehicleSchema);
