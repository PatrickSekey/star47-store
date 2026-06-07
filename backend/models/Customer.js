const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  firstName: {
    type: String,
    trim: true,
    default: ''
  },
  lastName: {
    type: String,
    trim: true,
    default: ''
  },
  address: {
    street: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    zipCode: { type: String, default: '' },
    country: { type: String, default: 'US' }
  },
  phone: { type: String, default: '' },
  orders: [{
    orderId: String,
    items: [{
      productName: String,
      size: String,
      quantity: Number,
      price: Number
    }],
    subtotal: Number,
    shippingFee: Number,
    total: Number,
    status: {
      type: String,
      enum: ['pending', 'paid', 'shipped', 'delivered', 'cancelled'],
      default: 'pending'
    },
    stripeSessionId: String,
    createdAt: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true  // This automatically adds createdAt and updatedAt
});

module.exports = mongoose.model('Customer', CustomerSchema);