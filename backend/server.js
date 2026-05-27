const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/vehicles', require('./routes/vehicles'));
app.use('/api/bids', require('./routes/bids'));
app.use('/api/companies', require('./routes/companies'));
app.use('/api/upload', require('./routes/upload'));

// Serve the uploads folder statically so frontend can access images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log('Database connection error:', err));

app.get('/', (req, res) => {
    res.send('CarRents.lk API is running...');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// Trigger restart again for .env
