require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const propertyRoutes = require('./routes/propertyRoutes');


// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.send('RoomEase API is running...');
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});