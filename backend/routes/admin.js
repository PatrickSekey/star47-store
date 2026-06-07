const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');
const Order = require('../models/Order');
const { sendOrderStatusEmail } = require('../services/emailService');

// Get all customers (with pagination)
router.get('/customers', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const customers = await Customer.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Customer.countDocuments();
    
    res.json({
      success: true,
      customers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single customer with orders
router.get('/customers/:id', async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.json({ success: true, customer });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all orders
router.get('/orders', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const status = req.query.status;
    
    let query = {};
    if (status && status !== 'all') {
      query.status = status;
    }
    
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Order.countDocuments(query);
    
    res.json({
      success: true,
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single order
router.get('/orders/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update order status (with email notification)
router.patch('/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    const oldStatus = order.status;
    order.status = status;
    order.updatedAt = Date.now();
    await order.save();
    
    // Also update customer's order status
    const customer = await Customer.findOne({ email: order.customerEmail });
    if (customer) {
      const orderIndex = customer.orders.findIndex(o => o.orderId === order.orderNumber);
      if (orderIndex !== -1) {
        customer.orders[orderIndex].status = status;
        await customer.save();
      }
    }
    
    // Send status update email (don't await - let it run in background)
    if (oldStatus !== status) {
      sendOrderStatusEmail(order, oldStatus, status).catch(err => {
        console.error('❌ Failed to send status update email:', err.message);
      });
    }
    
    res.json({ success: true, order });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const totalCustomers = await Customer.countDocuments();
    const totalOrders = await Order.countDocuments();
    const paidOrders = await Order.countDocuments({ status: 'paid' });
    const shippedOrders = await Order.countDocuments({ status: 'shipped' });
    const deliveredOrders = await Order.countDocuments({ status: 'delivered' });
    
    // Calculate total revenue
    const revenue = await Order.aggregate([
      { $match: { status: { $in: ['paid', 'shipped', 'delivered'] } } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);
    
    res.json({
      success: true,
      stats: {
        totalCustomers,
        totalOrders,
        paidOrders,
        shippedOrders,
        deliveredOrders,
        totalRevenue: revenue[0]?.total || 0
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;