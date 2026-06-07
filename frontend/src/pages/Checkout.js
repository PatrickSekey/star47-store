import React, { useState, useEffect } from 'react';
import { stripeService } from '../services/stripeService';
import './Checkout.css';

const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

// Size options with Roman numerals
const SIZES = [
  { id: 'S', name: 'Small', roman: 'I', order: 1 },
  { id: 'M', name: 'Medium', roman: 'II', order: 2 },
  { id: 'L', name: 'Large', roman: 'III', order: 3 },
  { id: 'XL', name: 'Extra Large', roman: 'IV', order: 4 }
];

// Product designs with actual images
const PRODUCTS = {
  tshirt: {
    id: 1,
    name: 'Star47 T-Shirt',
    price: 65.00,
    designs: [
      { 
        id: 1, 
        name: 'Classic Star47', 
        image: '/images/Shirt1.jpg',
        hoverImage: '/images/Shirt1.jpg',
        description: 'Original Star47 logo design on premium cotton'
      },
      { 
        id: 2, 
        name: 'Galaxy Edition', 
        image: '/images/Shirt2.jpg',
        hoverImage: '/images/Shirt2.jpg',
        description: 'Galaxy print with Star47 constellation design'
      },
      { 
        id: 3, 
        name: 'Minimalist', 
        image: '/images/Shirt3.jpg',
        hoverImage: '/images/Shirt3.jpg',
        description: 'Simple elegant star design for minimalists'
      }
    ]
  }
};

function Checkout() {
  const [cartItems, setCartItems] = useState([]);
  
  const [customerInfo, setCustomerInfo] = useState({
    email: '',
    firstName: '',
    lastName: '',
    state: '',
    address: '',
    city: '',
    zipCode: ''
  });
  const [shippingFee, setShippingFee] = useState(null);
  const [loading, setLoading] = useState(false);
  const [calculatingShipping, setCalculatingShipping] = useState(false);
  const [showProductSelector, setShowProductSelector] = useState(false);
  const [hoveredDesign, setHoveredDesign] = useState(null);
  const [selectedSize, setSelectedSize] = useState('M'); // Default to Medium (II)

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = subtotal + (shippingFee || 0);

  // Auto-calculate shipping when state changes or cart quantity changes
  useEffect(() => {
    if (customerInfo.state && cartItems.length > 0) {
      calculateShipping(customerInfo.state, getTotalQuantity());
    }
  }, [customerInfo.state, cartItems]);

  const addProduct = (productType, designId) => {
    const product = PRODUCTS[productType];
    const design = product.designs.find(d => d.id === designId);
    const size = SIZES.find(s => s.id === selectedSize);
    
    const existingItem = cartItems.find(
      item => item.productType === productType && 
              item.designId === designId && 
              item.size === selectedSize
    );
    
    if (existingItem) {
      handleQuantityChange(existingItem.id, existingItem.quantity + 1);
    } else {
      const newItem = {
        id: Date.now(),
        productType: productType,
        designId: designId,
        size: selectedSize,
        sizeName: size.name,
        sizeRoman: size.roman,
        name: `${product.name} - ${design.name}`,
        price: product.price,
        quantity: 1,
        image: design.image,
        hoverImage: design.hoverImage,
        description: design.description
      };
      setCartItems([...cartItems, newItem]);
    }
    
    setShowProductSelector(false);
  };

  const removeItem = (itemId) => {
    setCartItems(cartItems.filter(item => item.id !== itemId));
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      removeItem(itemId);
      return;
    }
    
    setCartItems(cartItems.map(item =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    ));
  };

  const getTotalQuantity = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  const calculateShipping = async (state, quantity) => {
    setCalculatingShipping(true);
    setShippingFee(null); // Reset shipping fee while calculating
    try {
      const result = await stripeService.calculateShippingFee(state, quantity);
      setShippingFee(result.shippingFee);
    } catch (error) {
      console.error('Shipping calculation failed:', error);
      setShippingFee(null);
    } finally {
      setCalculatingShipping(false);
    }
  };

  const handleStateChange = (e) => {
    const newState = e.target.value;
    console.log('State changed to:', newState);
    setCustomerInfo({ ...customerInfo, state: newState });
  };

  const handleCheckout = async () => {
    console.log('Checkout clicked. Validation check:', {
      email: !!customerInfo.email,
      state: !!customerInfo.state,
      shippingFee: !!shippingFee,
      cartItems: cartItems.length
    });
    
    if (!customerInfo.email) {
      alert('Please enter your email');
      return;
    }
    
    if (!customerInfo.state) {
      alert('Please select your state for shipping calculation');
      return;
    }
    
    if (!shippingFee && shippingFee !== 0) {
      alert('Please wait for shipping calculation to complete');
      return;
    }
    
    if (cartItems.length === 0) {
      alert('Please add items to your cart');
      return;
    }

    setLoading(true);
    
    try {
      const formattedItems = cartItems.map(item => ({
        id: item.id,
        name: `${item.name} (Size: ${item.sizeRoman})`,
        price: item.price,
        quantity: item.quantity,
        description: `${item.description} - Size ${item.sizeName} (${item.sizeRoman})`,
        sizeRoman: item.sizeRoman
      }));
      
      const customerInfoData = {
        name: `${customerInfo.firstName || ''} ${customerInfo.lastName || ''}`.trim() || customerInfo.email.split('@')[0],
        email: customerInfo.email,
        address: {
          street: customerInfo.address || '',
          city: customerInfo.city || '',
          state: customerInfo.state,
          zipCode: customerInfo.zipCode || ''
        }
      };
      
      console.log('Sending to backend:', { 
        items: formattedItems, 
        customerEmail: customerInfo.email, 
        shippingFee,
        customerInfo: customerInfoData 
      });
      
      const result = await stripeService.createCheckoutSession(
        formattedItems,
        customerInfo.email,
        shippingFee,
        customerInfoData
      );
      
      if (result.url) {
        window.location.href = result.url;
      } else {
        throw new Error('No checkout URL received from server');
      }
    } catch (error) {
      console.error('Checkout failed:', error);
      alert(`Checkout failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getSizeDisplay = (sizeId) => {
    const size = SIZES.find(s => s.id === sizeId);
    return size ? `${size.roman} (${size.name})` : sizeId;
  };

  // Check if pay button should be enabled
  const isPayButtonEnabled = !loading && shippingFee !== null && customerInfo.email && customerInfo.state && cartItems.length > 0;

  return (
    <div className="checkout-container">
      <div className="checkout-grid">
        {/* Cart Summary */}
        <div className="cart-summary">
          <h2>Your Order</h2>
          
          <div className="size-selector-section">
            <label>Select Size :</label>
            <div className="size-buttons">
              {SIZES.map(size => (
                <button
                  key={size.id}
                  className={`size-btn ${selectedSize === size.id ? 'active' : ''}`}
                  onClick={() => setSelectedSize(size.id)}
                >
                  <span className="size-roman">{size.roman}</span>
                  <span className="size-name">{size.name}</span>
                </button>
              ))}
            </div>
          </div>

          <button 
            className="add-product-btn"
            onClick={() => setShowProductSelector(!showProductSelector)}
          >
            + Add Product
          </button>
          
          {showProductSelector && (
            <>
              <div className="modal-overlay" onClick={() => setShowProductSelector(false)}></div>
              <div className="product-selector">
                <h3>Choose Your Design</h3>
                <div className="selected-size-indicator">
                  Selected Size: <strong>{getSizeDisplay(selectedSize)}</strong>
                </div>
                <div className="design-grid">
                  {PRODUCTS.tshirt.designs.map(design => (
                    <div 
                      key={design.id} 
                      className="design-card"
                      onClick={() => addProduct('tshirt', design.id)}
                      onMouseEnter={() => setHoveredDesign(design.id)}
                      onMouseLeave={() => setHoveredDesign(null)}
                    >
                      <div className="design-image-container">
                        <img 
                          src={hoveredDesign === design.id ? design.hoverImage : design.image} 
                          alt={design.name}
                          className="design-image"
                        />
                      </div>
                      <div className="design-name">{design.name}</div>
                      <div className="design-price">${PRODUCTS.tshirt.price}</div>
                      <div className="design-description">{design.description}</div>
                    </div>
                  ))}
                </div>
                <button className="cancel-btn" onClick={() => setShowProductSelector(false)}>Cancel</button>
              </div>
            </>
          )}
          
          <div className="cart-items">
            {cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-image">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="item-details">
                  <h3>{item.name}</h3>
                  <div className="item-size-badge">
                    Size: <span className="size-badge">{item.sizeRoman}</span>
                  </div>
                  <p className="item-price">${item.price.toFixed(2)} each</p>
                  <p className="item-description">{item.description}</p>
                  <button className="remove-btn" onClick={() => removeItem(item.id)}>Remove</button>
                </div>
                <div className="item-quantity">
                  <button onClick={() => handleQuantityChange(item.id, item.quantity - 1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>+</button>
                </div>
                <div className="item-total">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
          
          {cartItems.length === 0 && (
            <div className="empty-cart">
              <p>Your cart is empty. Select a size and click "Add Product" to start shopping!</p>
            </div>
          )}
          
          <div className="summary-details">
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping:</span>
              <span>
                {calculatingShipping ? (
                  'Calculating...'
                ) : shippingFee !== null ? (
                  `$${shippingFee.toFixed(2)}`
                ) : (
                  'Select state'
                )}
              </span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Shipping Information */}
        <div className="shipping-info">
          <h2>Shipping Information</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label>First Name</label>
              <input
                type="text"
                value={customerInfo.firstName}
                onChange={(e) => setCustomerInfo({ ...customerInfo, firstName: e.target.value })}
                placeholder="John"
              />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input
                type="text"
                value={customerInfo.lastName}
                onChange={(e) => setCustomerInfo({ ...customerInfo, lastName: e.target.value })}
                placeholder="Doe"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label>Email Address *</label>
            <input
              type="email"
              value={customerInfo.email}
              onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
              placeholder="your@email.com"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Street Address</label>
            <input
              type="text"
              value={customerInfo.address}
              onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
              placeholder="123 Main St"
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                value={customerInfo.city}
                onChange={(e) => setCustomerInfo({ ...customerInfo, city: e.target.value })}
                placeholder="City"
              />
            </div>
            <div className="form-group">
              <label>State *</label>
              <select value={customerInfo.state} onChange={handleStateChange} required>
                <option value="">Select State</option>
                {US_STATES.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>ZIP Code</label>
              <input
                type="text"
                value={customerInfo.zipCode}
                onChange={(e) => setCustomerInfo({ ...customerInfo, zipCode: e.target.value })}
                placeholder="12345"
              />
            </div>
          </div>
          
          <button 
            className="checkout-button"
            onClick={handleCheckout}
            disabled={!isPayButtonEnabled}
          >
            {loading ? 'Processing...' : `Pay $${total.toFixed(2)}`}
          </button>
          {!isPayButtonEnabled && customerInfo.state && shippingFee === null && !calculatingShipping && (
            <p style={{ color: 'red', fontSize: '12px', marginTop: '10px' }}>
              ⚠️ Please wait for shipping calculation...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Checkout;