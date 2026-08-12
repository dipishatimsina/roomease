require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const propertyRoutes = require('./routes/propertyRoutes');
const roomRoutes = require('./routes/roomRoutes');
const adminRoutes = require('./routes/adminRoutes');
const inquiryRoutes = require('./routes/inquiryRoutes');
const visitRoutes = require('./routes/visitRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const savedRoomRoutes = require('./routes/savedRoomRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const reportRoutes = require('./routes/reportRoutes');
const tenancyRoutes = require('./routes/tenancyRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

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
app.use('/api/rooms', roomRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/visits', visitRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/saved-rooms', savedRoomRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/tenancies', tenancyRoutes);
app.use('/api/analytics', analyticsRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});