const nodemailer = require('nodemailer');

// Create transporter only if email is configured
let transporter = null;

const initTransporter = () => {
  // Check if email credentials are provided
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('⚠️ Email service disabled: Missing EMAIL_USER or EMAIL_PASS in .env');
    return false;
  }
  
  if (process.env.EMAIL_ENABLED === 'false') {
    console.log('⚠️ Email service disabled: EMAIL_ENABLED=false');
    return false;
  }
  
  try {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true' || false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    console.log('✅ Email service initialized');
    return true;
  } catch (error) {
    console.error('❌ Failed to initialize email service:', error.message);
    return false;
  }
};

// Send welcome email to new customers
const sendWelcomeEmail = async (customerEmail, firstName) => {
  // Check if email is configured
  if (!transporter) {
    console.log('📧 Email skipped (not configured): Welcome email to', customerEmail);
    return false;
  }
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { padding: 30px; background: #f8f9fa; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        .star { color: #FFD700; font-size: 24px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="star">⭐</div>
          <h1>Welcome to STAR47!</h1>
        </div>
        <div class="content">
          <h2>Hello ${firstName || 'there'}! 👋</h2>
          <p>Thank you for joining the STAR47 family! We're excited to have you with us.</p>
          <p>You now have access to:</p>
          <ul>
            <li>✨ Exclusive limited edition drops</li>
            <li>🚚 Free shipping on orders over $100</li>
            <li>🎯 First access to new collections</li>
            <li>💫 Special member-only discounts</li>
          </ul>
          <p>Start shopping now and get 10% off your first order!</p>
          <a href="http://localhost:3000" class="button">Shop Now →</a>
          <p style="margin-top: 20px;">Use code: <strong>WELCOME10</strong> at checkout</p>
        </div>
        <div class="footer">
          <p>STAR47 | Premium Apparel</p>
          <p>Questions? Contact us at support@star47.com</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: `"STAR47" <${process.env.EMAIL_USER}>`,
    to: customerEmail,
    subject: '🎉 Welcome to STAR47! Exclusive Offers Inside',
    html: html
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Welcome email sent to ${customerEmail}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending welcome email:', error.message);
    return false;
  }
};

// Send order confirmation email
const sendOrderConfirmationEmail = async (order) => {
  // Check if email is configured
  if (!transporter) {
    console.log('📧 Email skipped (not configured): Order confirmation to', order.customerEmail);
    return false;
  }
  
  // Generate order items HTML
  const itemsHtml = (order.items || []).map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.productName || 'Product'}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.sizeRoman || item.size || 'N/A'}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.quantity || 1}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">$${item.price || 0}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">$${(item.price || 0) * (item.quantity || 1)}</td>
    </tr>
  `).join('');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { padding: 30px; background: #f8f9fa; border-radius: 0 0 10px 10px; }
        .order-details { background: white; padding: 20px; border-radius: 10px; margin: 20px 0; }
        table { width: 100%; border-collapse: collapse; }
        th { background: #667eea; color: white; padding: 10px; text-align: left; }
        .total-row { font-weight: bold; font-size: 18px; }
        .status { display: inline-block; padding: 5px 10px; background: #28a745; color: white; border-radius: 5px; font-size: 12px; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        .track-button { display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="star">⭐</div>
          <h1>Order Confirmation</h1>
          <p>Order #${order.orderNumber || 'N/A'}</p>
        </div>
        <div class="content">
          <h2>Thank you for your order, ${order.customerInfo?.name || 'Valued Customer'}! 🎉</h2>
          <p>We've received your order and it's now being processed.</p>
          
          <div class="order-details">
            <h3>Order Summary</h3>
            <table>
              <thead>
                <tr><th>Product</th><th>Size</th><th>Qty</th><th>Price</th><th>Total</th></tr>
              </thead>
              <tbody>
                ${itemsHtml || '<tr><td colspan="5">No items</td></tr>'}
              </tbody>
            </table>
            
            <div style="margin-top: 20px; text-align: right;">
              <p><strong>Subtotal:</strong> $${(order.subtotal || 0).toFixed(2)}</p>
              <p><strong>Shipping:</strong> $${(order.shippingFee || 0).toFixed(2)}</p>
              <p class="total-row"><strong>Total:</strong> $${(order.total || 0).toFixed(2)}</p>
            </div>
            
            <p><strong>Order Status:</strong> <span class="status">${order.status || 'pending'}</span></p>
          </div>
          
          <div class="order-details">
            <h3>Shipping Information</h3>
            <p>
              ${order.customerInfo?.name || 'N/A'}<br>
              ${order.customerInfo?.address?.street || 'N/A'}<br>
              ${order.customerInfo?.address?.city || ''}, ${order.customerInfo?.address?.state || ''} ${order.customerInfo?.address?.zipCode || ''}
            </p>
          </div>
          
          <a href="http://localhost:3000/track/${order.orderNumber}" class="track-button">Track Your Order →</a>
          
          <p style="margin-top: 20px;">We'll notify you when your order ships.</p>
        </div>
        <div class="footer">
          <p>STAR47 | Premium Apparel</p>
          <p>Questions? Contact us at support@star47.com</p>
          <p>&copy; 2026 STAR47. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: `"STAR47" <${process.env.EMAIL_USER}>`,
    to: order.customerEmail,
    subject: `✅ Order Confirmed #${order.orderNumber} - STAR47`,
    html: html
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Order confirmation email sent to ${order.customerEmail}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending order confirmation:', error.message);
    return false;
  }
};

// Send order status update email
const sendOrderStatusEmail = async (order, oldStatus, newStatus) => {
  // Check if email is configured
  if (!transporter) {
    console.log('📧 Email skipped (not configured): Status update to', order.customerEmail);
    return false;
  }
  
  const statusMessages = {
    processing: 'is being processed',
    shipped: 'has been shipped! 🚚',
    delivered: 'has been delivered! 📦',
    cancelled: 'has been cancelled',
    paid: 'has been confirmed and paid for ✅'
  };

  const message = statusMessages[newStatus] || `has been updated to ${newStatus}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { padding: 30px; background: #f8f9fa; border-radius: 0 0 10px 10px; }
        .status-update { background: white; padding: 20px; border-radius: 10px; text-align: center; margin: 20px 0; }
        .status-badge { display: inline-block; padding: 8px 16px; background: #28a745; color: white; border-radius: 20px; font-size: 14px; font-weight: bold; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        .track-button { display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="star">⭐</div>
          <h1>Order Status Update</h1>
          <p>Order #${order.orderNumber}</p>
        </div>
        <div class="content">
          <h2>Hello ${order.customerInfo?.name || 'Valued Customer'}!</h2>
          <div class="status-update">
            <p style="font-size: 18px; margin-bottom: 10px;">Your order ${message}</p>
            <div class="status-badge">${newStatus.toUpperCase()}</div>
          </div>
          <a href="http://localhost:3000/track/${order.orderNumber}" class="track-button">Track Your Order →</a>
          <p style="margin-top: 20px;">Thank you for shopping with STAR47!</p>
        </div>
        <div class="footer">
          <p>STAR47 | Premium Apparel</p>
          <p>Questions? Contact us at support@star47.com</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: `"STAR47" <${process.env.EMAIL_USER}>`,
    to: order.customerEmail,
    subject: `📦 Order #${order.orderNumber} Status Update - ${newStatus.toUpperCase()}`,
    html: html
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Status update email sent to ${order.customerEmail}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending status update:', error.message);
    return false;
  }
};

// Initialize email service
initTransporter();

module.exports = {
  sendWelcomeEmail,
  sendOrderConfirmationEmail,
  sendOrderStatusEmail
};