import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { stripeService } from '../services/stripeService';
import { 
  ShoppingBag, 
  X, 
  Minus, 
  Plus, 
  Truck, 
  CreditCard,
  ChevronRight,
  Mail,
  Home,
  Building,
  Globe,
  AlertCircle
} from 'lucide-react';

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
    price: 50.00,
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
  const navigate = useNavigate();
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    addToCart,
    getTotalPrice,
    getTotalItems,
    clearCart 
  } = useCart(); // ✅ Moved to top level
  
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
  const [selectedSize, setSelectedSize] = useState('M');
  const [error, setError] = useState('');

  const subtotal = getTotalPrice();
  const total = subtotal + (shippingFee || 0);
  const totalItems = getTotalItems();

  // Auto-calculate shipping when state changes or cart changes
  useEffect(() => {
    if (customerInfo.state && cartItems.length > 0) {
      calculateShipping(customerInfo.state, totalItems);
    }
  }, [customerInfo.state, cartItems, totalItems]);

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
      updateQuantity(existingItem.id, existingItem.quantity + 1);
    } else {
      const newItem = {
        id: Date.now() + Math.random(),
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
      // Use addToCart from context (already available at top level)
      addToCart(newItem);
    }
    
    setShowProductSelector(false);
  };

  const removeItem = (itemId) => {
    removeFromCart(itemId);
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    updateQuantity(itemId, newQuantity);
  };

  const calculateShipping = async (state, quantity) => {
    setCalculatingShipping(true);
    setShippingFee(null);
    setError('');
    try {
      const result = await stripeService.calculateShippingFee(state, quantity);
      setShippingFee(result.shippingFee);
    } catch (error) {
      console.error('Shipping calculation failed:', error);
      setError('Failed to calculate shipping. Please try again.');
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
      setError('Please enter your email');
      return;
    }
    
    if (!customerInfo.state) {
      setError('Please select your state for shipping calculation');
      return;
    }
    
    if (!shippingFee && shippingFee !== 0) {
      setError('Please wait for shipping calculation to complete');
      return;
    }
    
    if (cartItems.length === 0) {
      setError('Please add items to your cart');
      return;
    }

    setLoading(true);
    setError('');
    
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
        // Clear cart after successful checkout
        clearCart();
        window.location.href = result.url;
      } else {
        throw new Error('No checkout URL received from server');
      }
    } catch (error) {
      console.error('Checkout failed:', error);
      setError(`Checkout failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getSizeDisplay = (sizeId) => {
    const size = SIZES.find(s => s.id === sizeId);
    return size ? `${size.roman} (${size.name})` : sizeId;
  };

  const isPayButtonEnabled = !loading && shippingFee !== null && customerInfo.email && customerInfo.state && cartItems.length > 0;

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <ChevronRight size={16} />
          <Link to="/services" className="hover:text-blue-600 transition-colors">Fashion</Link>
          <ChevronRight size={16} />
          <span className="text-gray-900 font-medium">Checkout</span>
        </nav>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center space-x-2">
            <AlertCircle size={20} />
            <span>{error}</span>
            <button 
              onClick={() => setError('')}
              className="ml-auto text-red-700 hover:text-red-900"
            >
              <X size={18} />
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Summary - Left Side */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Your Order</h2>
                <span className="text-sm text-gray-500">{cartItems.length} items</span>
              </div>
              
              {/* Size Selector */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Select Size</label>
                <div className="flex gap-3">
                  {SIZES.map(size => (
                    <button
                      key={size.id}
                      className={`py-2 px-4 rounded-lg border-2 text-center transition-all duration-200 flex-1 ${
                        selectedSize === size.id 
                          ? 'border-[#FF9900] bg-[#FFF4E6] text-[#FF9900] shadow-sm' 
                          : 'border-gray-200 hover:border-gray-400 text-gray-700'
                      }`}
                      onClick={() => setSelectedSize(size.id)}
                    >
                      <div className="font-bold text-sm">{size.roman}</div>
                      <div className="text-xs">{size.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Add Product Button */}
              <button 
                className="w-full mb-6 bg-blue-50 hover:bg-blue-100 text-blue-600 font-semibold py-3 px-6 rounded-lg transition-colors border-2 border-dashed border-blue-300"
                onClick={() => setShowProductSelector(!showProductSelector)}
              >
                + Add Product
              </button>

              {/* Product Selector Modal */}
              {showProductSelector && (
                <>
                  <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowProductSelector(false)}></div>
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[80vh] overflow-y-auto p-6 animate-fade-in">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-2xl font-bold text-gray-900">Choose Your Design</h3>
                        <button 
                          onClick={() => setShowProductSelector(false)}
                          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                          <X size={24} />
                        </button>
                      </div>
                      <div className="text-sm text-gray-500 mb-4">
                        Selected Size: <strong className="text-[#FF9900]">{getSizeDisplay(selectedSize)}</strong>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {PRODUCTS.tshirt.designs.map(design => (
                          <div 
                            key={design.id} 
                            className="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-300 cursor-pointer hover:border-[#FF9900]"
                            onClick={() => addProduct('tshirt', design.id)}
                            onMouseEnter={() => setHoveredDesign(design.id)}
                            onMouseLeave={() => setHoveredDesign(null)}
                          >
                            <div className="relative overflow-hidden rounded-lg mb-3">
                              <img 
                                src={hoveredDesign === design.id ? design.hoverImage : design.image} 
                                alt={design.name}
                                className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                              />
                            </div>
                            <h4 className="font-semibold text-gray-900">{design.name}</h4>
                            <p className="text-[#FF9900] font-bold">${PRODUCTS.tshirt.price.toFixed(2)}</p>
                            <p className="text-xs text-gray-500 mt-1">{design.description}</p>
                          </div>
                        ))}
                      </div>
                      <button 
                        className="mt-4 w-full py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        onClick={() => setShowProductSelector(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* Cart Items */}
              <div className="space-y-4">
                {cartItems.map(item => (
                  <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-sm">{item.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500">Size:</span>
                        <span className="inline-flex items-center justify-center bg-[#FF9900] text-white text-xs font-bold w-6 h-6 rounded-full">
                          {item.sizeRoman}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">${item.price.toFixed(2)} each</p>
                      <button 
                        className="text-xs text-red-500 hover:text-red-700 mt-1 transition-colors"
                        onClick={() => removeItem(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        className="w-8 h-8 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      >
                        <Minus size={14} className="mx-auto" />
                      </button>
                      <span className="w-8 text-center font-semibold">{item.quantity}</span>
                      <button 
                        className="w-8 h-8 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      >
                        <Plus size={14} className="mx-auto" />
                      </button>
                    </div>
                    <div className="text-right min-w-[80px]">
                      <span className="font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>

              {cartItems.length === 0 && (
                <div className="text-center py-12">
                  <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">Your cart is empty.</p>
                  <Link to="/services" className="inline-block mt-4 text-[#FF9900] hover:text-[#e68900] font-semibold">
                    Browse Products →
                  </Link>
                </div>
              )}

              {/* Summary */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({totalItems} items)</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
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
                  <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t border-gray-200">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Information - Right Side */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping Information</h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input
                      type="text"
                      value={customerInfo.firstName}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, firstName: e.target.value })}
                      placeholder="John"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input
                      type="text"
                      value={customerInfo.lastName}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, lastName: e.target.value })}
                      placeholder="Doe"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900] focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                      placeholder="your@email.com"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900] focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                  <div className="relative">
                    <Home size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={customerInfo.address}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                      placeholder="123 Main St"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900] focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <div className="relative">
                      <Building size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={customerInfo.city}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, city: e.target.value })}
                        placeholder="City"
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900] focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                    <input
                      type="text"
                      value={customerInfo.zipCode}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, zipCode: e.target.value })}
                      placeholder="12345"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900] focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Globe size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <select 
                      value={customerInfo.state} 
                      onChange={handleStateChange} 
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900] focus:border-transparent appearance-none bg-white"
                      required
                    >
                      <option value="">Select State</option>
                      {US_STATES.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <button 
                className={`w-full mt-6 py-4 rounded-lg font-bold text-white transition-all duration-300 flex items-center justify-center gap-2 ${
                  isPayButtonEnabled 
                    ? 'bg-[#FF9900] hover:bg-[#e68900] transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[#FF9900]/25' 
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
                onClick={handleCheckout}
                disabled={!isPayButtonEnabled}
              >
                <CreditCard size={20} />
                {loading ? 'Processing...' : `Pay $${total.toFixed(2)}`}
              </button>

              {!isPayButtonEnabled && customerInfo.state && shippingFee === null && !calculatingShipping && cartItems.length > 0 && (
                <p className="text-xs text-gray-500 mt-3 text-center">
                  ⚠️ Please wait for shipping calculation...
                </p>
              )}

              <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Truck size={14} /> Free shipping over $100
                </span>
                <span>•</span>
                <span>Secure checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;