const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  customerEmail: {
    type: String,
    required: true,
    lowercase: true
  },
  customerInfo: {
    name: { type: String, default: '' },
    email: { type: String, required: true },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String
    }
  },
  items: [{
    productName: String,
    size: String,
    sizeRoman: String,
    quantity: Number,
    price: Number
  }],
  subtotal: {
    type: Number,
    required: true
  },
  shippingFee: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  orderNumber: {
    type: String,
    unique: true
  },
  stripeSessionId: String,
  stripePaymentIntentId: String,
  status: {
    type: String,
    enum: ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// Helper function to generate order number (NOT a pre-save hook)
function generateOrderNumber() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `STAR47-${year}${month}${day}-${random}`;
}

module.exports = { Order: mongoose.model('Order', OrderSchema), generateOrderNumber };