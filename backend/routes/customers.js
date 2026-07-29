const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');
const { sendWelcomeEmail } = require('../services/emailService');

// Test route
router.get('/test', (req, res) => {
  res.json({ message: 'Customers route is working' });
});

// Get all customers
router.get('/', async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get customer by email
router.get('/:email', async (req, res) => {
  try {
    const customer = await Customer.findOne({ email: req.params.email.toLowerCase() });
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create customer
router.post('/', async (req, res) => {
  try {
    console.log('📝 POST /api/customers - Body:', req.body);
    
    const { email, firstName, lastName, address, phone } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    
    // Check if customer already exists
    let customer = await Customer.findOne({ email: email.toLowerCase() });
    
    if (customer) {
      // Update existing customer
      if (firstName) customer.firstName = firstName;
      if (lastName) customer.lastName = lastName;
      if (phone) customer.phone = phone;
      if (address) customer.address = { ...customer.address, ...address };
      
      await customer.save();
      console.log('✅ Customer updated:', customer.email);
      return res.json({ success: true, customer });
    } else {
      // Create new customer
      customer = new Customer({
        email: email.toLowerCase(),
        firstName: firstName || '',
        lastName: lastName || '',
        address: address || {},
        phone: phone || ''
      });
      
      await customer.save();
      console.log('✅ Customer created:', customer.email);
      
      // Send welcome email to new customers only
      try {
        await sendWelcomeEmail(customer.email, customer.firstName);
        console.log('📧 Welcome email sent to:', customer.email);
      } catch (emailError) {
        console.error('❌ Failed to send welcome email:', emailError.message);
        // Don't fail the request if email fails
      }
      
      return res.status(201).json({ success: true, customer });
    }
  } catch (error) {
    console.error('❌ Error in POST /api/customers:', error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;