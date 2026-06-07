const express = require('express');
const router = express.Router();
const { calculateShippingFee } = require('../controllers/shippingController');

// Calculate shipping fee based on state and quantity
router.post('/calculate', async (req, res) => {
  try {
    const { state, quantity } = req.body;

    if (!state || !quantity) {
      return res.status(400).json({ error: 'State and quantity are required' });
    }

    const shippingFee = calculateShippingFee(state, quantity);
    
    res.json({
      shippingFee,
      currency: 'usd',
      state,
      quantity
    });
  } catch (error) {
    console.error('Error calculating shipping:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;