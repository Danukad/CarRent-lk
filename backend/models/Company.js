const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    companyName: { type: String, required: true },
    logo: { type: String, default: '' },
    description: { type: String, default: '' },
    contactEmail: { type: String, default: '' },
    phone: { type: String, default: '' },
    address: { type: String, default: '' },
    isVerified: { type: Boolean, default: true }, // auto-approved; hook for future admin review
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Company', CompanySchema);
