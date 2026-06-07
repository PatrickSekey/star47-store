# ⭐ STAR47 - Premium T-Shirts E-commerce Store

A full-stack e-commerce platform for premium apparel with Stripe integration, dynamic shipping calculator, and admin dashboard.

## 🚀 Features

- **Modern React Frontend** with responsive design
- **Node.js Backend** with Express.js
- **Stripe Payment Integration** for secure checkout
- **Dynamic Shipping Calculator** based on US state and item quantity
- **MongoDB Atlas** for customer and order management
- **Admin Dashboard** to manage customers and orders
- **Email Notifications** for welcome emails and order confirmations
- **Product Selection** with 3 designs (Classic, Galaxy, Minimalist)
- **Size Selection** with Roman numerals (I, II, III, IV)

## 🛠️ Tech Stack

### Frontend
- React.js
- CSS3 with modern design
- Stripe.js for payments

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- Stripe API
- Nodemailer for emails

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account (free tier)
- Stripe account (test mode)

### Environment Variables

Create `backend/.env`:
```env
PORT=5000
STRIPE_SECRET_KEY=your_stripe_secret_key
FRONTEND_URL=http://localhost:3000
MONGODB_URI=your_mongodb_connection_string
EMAIL_ENABLED=false
