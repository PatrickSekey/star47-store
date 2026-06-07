// Load environment variables FIRST
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Middleware - ORDER MATTERS!
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Import routes
const checkoutRoutes = require('./routes/checkout');
const shippingRoutes = require('./routes/shipping');
const customerRoutes = require('./routes/customers');
const orderRoutes = require('./routes/orders');
const adminRoutes = require('./routes/admin');

// Use routes
app.use('/api/checkout', checkoutRoutes);
app.use('/api/shipping', shippingRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

// Basic test route
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Backend is working!',
    stripeConfigured: !!process.env.STRIPE_SECRET_KEY,
    mongoConfigured: !!process.env.MONGODB_URI
  });
});

// Error handling middleware - MUST BE LAST!
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
  console.log(`Stripe API Key configured: ${!!process.env.STRIPE_SECRET_KEY}`);
  console.log(`MongoDB configured: ${!!process.env.MONGODB_URI}`);
});