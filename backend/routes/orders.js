const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Customer = require('../models/Customer');

// Create new order
router.post('/', async (req, res) => {
  try {
    const orderData = req.body;
    const order = new Order(orderData);
    await order.save();
    
    // Also add to customer's orders
    const customer = await Customer.findOne({ email: order.customerEmail });
    if (customer) {
      customer.orders.push({
        orderId: order.orderNumber,
        items: order.items,
        subtotal: order.subtotal,
        shippingFee: order.shippingFee,
        total: order.total,
        stripeSessionId: order.stripeSessionId,
        status: order.status
      });
      await customer.save();
    }
    
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get order by order number
router.get('/:orderNumber', async (req, res) => {
  try {
    const order = await Order.findOne({ orderNumber: req.params.orderNumber });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get orders by customer email
router.get('/customer/:email', async (req, res) => {
  try {
    const orders = await Order.find({ customerEmail: req.params.email.toLowerCase() })
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;