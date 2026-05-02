const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
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
