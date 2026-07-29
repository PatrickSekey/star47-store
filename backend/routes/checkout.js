const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { sendOrderConfirmationEmail } = require('../services/emailService');
const { Order, generateOrderNumber } = require('../models/Order');

// Create a checkout session
router.post('/create-session', async (req, res) => {
  try {
    const { items, customerEmail, shippingFee, customerInfo } = req.body;
    
    console.log('Received checkout request:', { items, customerEmail, shippingFee, customerInfo });

    // Validate required fields
    if (!items || items.length === 0) {
      throw new Error('No items in cart');
    }
    if (!customerEmail) {
      throw new Error('Customer email is required');
    }

    // Calculate totals
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = subtotal + (shippingFee || 0);
    
    // Prepare customer info with default values
    const defaultCustomerInfo = {
      name: customerEmail.split('@')[0],
      email: customerEmail,
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: ''
      }
    };
    
    const finalCustomerInfo = customerInfo || defaultCustomerInfo;
    
    // Generate order number
    const orderNumber = generateOrderNumber();
    console.log('🔢 Generated order number:', orderNumber);
    
    // Create order in database
    const order = new Order({
      orderNumber: orderNumber,
      customerEmail: customerEmail,
      customerInfo: {
        name: finalCustomerInfo.name || finalCustomerInfo.email.split('@')[0],
        email: finalCustomerInfo.email,
        address: {
          street: finalCustomerInfo.address?.street || '',
          city: finalCustomerInfo.address?.city || '',
          state: finalCustomerInfo.address?.state || '',
          zipCode: finalCustomerInfo.address?.zipCode || ''
        }
      },
      items: items.map(item => ({
        productName: item.name,
        size: item.sizeRoman || 'N/A',
        sizeRoman: item.sizeRoman || 'N/A',
        quantity: item.quantity,
        price: item.price
      })),
      subtotal: subtotal,
      shippingFee: shippingFee || 0,
      total: total,
      status: 'pending'
    });
    
    // Save order
    const savedOrder = await order.save();
    console.log('✅ Order created in database:', savedOrder.orderNumber);

    // Format line items for Stripe
    const lineItems = items.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          description: item.description || 'Star47 T-Shirt',
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    // Add shipping as a separate line item if shipping fee exists and is > 0
    if (shippingFee && shippingFee > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Shipping Fee',
            description: 'Based on location and item quantity',
          },
          unit_amount: Math.round(shippingFee * 100),
        },
        quantity: 1,
      });
    }

    // Create the Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/cancel`,
      customer_email: customerEmail,
      shipping_address_collection: {
        allowed_countries: ['US'],
      },
      metadata: {
        items_count: items.reduce((sum, item) => sum + item.quantity, 0).toString(),
        shipping_fee: shippingFee ? shippingFee.toString() : '0',
        orderId: savedOrder._id.toString(),
        orderNumber: savedOrder.orderNumber
      },
    });

    // Update order with Stripe session ID
    savedOrder.stripeSessionId = session.id;
    await savedOrder.save();
    console.log('✅ Order updated with Stripe session ID');

    // Send order confirmation email (don't await - let it run in background)
    sendOrderConfirmationEmail(savedOrder).catch(err => {
      console.error('❌ Failed to send order confirmation email:', err.message);
    });

    console.log('✅ Checkout session created:', session.id);
    console.log('📧 Order confirmation email sent to:', customerEmail);
    
    res.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('❌ Error creating checkout session:', error);
    res.status(500).json({ error: error.message });
  }
});

// Retrieve session details
router.get('/session/:sessionId', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);
    
    // If session is complete, update order status
    if (session.payment_status === 'paid') {
      const order = await Order.findOne({ stripeSessionId: session.id });
      if (order && order.status !== 'paid') {
        order.status = 'paid';
        await order.save();
        console.log('✅ Order marked as paid:', order.orderNumber);
      }
    }
    
    res.json(session);
  } catch (error) {
    console.error('Error retrieving session:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;