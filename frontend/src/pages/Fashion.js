import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ChevronLeft, Minus, Plus, ShoppingBag, Shield, Truck, RotateCcw, Star } from 'lucide-react';

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
        description: 'Original Star47 logo design on premium cotton. Effortless elegance with every wear.',
        details: '• 100% premium cotton\n• Soft, lightweight, non-sticky feel\n• Designed for all-day comfort\n• Available in sizes I-IV'
      },
      { 
        id: 2, 
        name: 'Galaxy Edition', 
        image: '/images/Shirt2.jpg',
        description: 'Galaxy print with Star47 constellation design. A cosmic statement piece.',
        details: '• Premium cotton blend\n• Unique galaxy print\n• Soft and breathable\n• Available in sizes I-IV'
      },
      { 
        id: 3, 
        name: 'Minimalist', 
        image: '/images/Shirt3.jpg',
        description: 'Simple elegant star design for minimalists. Less is more.',
        details: '• 100% organic cotton\n• Minimalist design\n• Everyday essential\n• Available in sizes I-IV'
      }
    ]
  },
  hoodie: {
    id: 2,
    name: 'Star47 Hoodie',
    price: 75.00,
    designs: [
      { 
        id: 1, 
        name: 'Classic Star47 Hoodie', 
        image: '/images/Hoodie1.jpg',
        description: 'Premium hoodie with Star47 logo. Cozy comfort meets street style.',
        details: '• 80% cotton, 20% polyester\n• Kangaroo pocket\n• Adjustable drawstring hood\n• Available in sizes I-IV'
      },
      { 
        id: 2, 
        name: 'Constellation Hoodie', 
        image: '/images/Hoodie2.jpg',
        description: 'Star constellation design on premium hoodie. A celestial statement.',
        details: '• Premium cotton blend\n• Unique constellation print\n• Soft fleece interior\n• Available in sizes I-IV'
      }
    ]
  }
};

const SIZES = [
  { id: 'S', name: 'Small', roman: 'I', order: 1 },
  { id: 'M', name: 'Medium', roman: 'II', order: 2 },
  { id: 'L', name: 'Large', roman: 'III', order: 3 },
  { id: 'XL', name: 'Extra Large', roman: 'IV', order: 4 }
];

const Fashion = () => {
  const { productType, designId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart(); // Get addToCart from context
  
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [design, setDesign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    setLoading(true);
    const productData = PRODUCTS[productType];
    if (!productData) {
      navigate('/');
      return;
    }
    
    const designData = productData.designs.find(d => d.id === parseInt(designId));
    if (!designData) {
      navigate('/');
      return;
    }
    
    setProduct(productData);
    setDesign(designData);
    setLoading(false);
  }, [productType, designId, navigate]);

  // Auto-hide alert after 3 seconds
  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product || !design) {
    return null;
  }

  const handleAddToCart = () => {
    const size = SIZES.find(s => s.id === selectedSize);
    const item = {
      productType: productType,
      designId: design.id,
      size: selectedSize,
      sizeName: size.name,
      sizeRoman: size.roman,
      name: `${product.name} - ${design.name}`,
      price: product.price,
      quantity: quantity,
      image: design.image,
      description: design.description
    };
    
    addToCart(item);
    setAlertMessage(`${item.name} added to cart!`);
    setShowAlert(true);
    
    // Optional: Navigate to checkout after a delay
    // setTimeout(() => navigate('/checkout'), 1500);
  };

  const detailsArray = design.details.split('\n').filter(line => line.trim());

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Success Alert */}
      {showAlert && (
        <div className="fixed top-20 right-4 z-50 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg animate-slide-in max-w-md">
          <div className="flex items-center space-x-3">
            <ShoppingBag size={20} />
            <span className="font-medium">{alertMessage}</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/services" className="hover:text-blue-600 transition-colors">Fashion</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">{design.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white rounded-2xl shadow-lg p-6 lg:p-8">
          {/* Product Image */}
          <div className="relative">
            <div className="bg-gray-100 rounded-xl overflow-hidden aspect-square">
              <img 
                src={design.image} 
                alt={design.name} 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              <span className="bg-[#FF9900] text-white px-3 py-1 rounded-full text-sm font-bold">
                New
              </span>
            </div>
            {/* Rating */}
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-lg flex items-center space-x-1">
              <Star size={16} className="text-yellow-400 fill-yellow-400" />
              <span className="font-semibold text-sm">4.8</span>
              <span className="text-gray-500 text-sm">(234 reviews)</span>
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Brand & Title */}
            <div>
              <p className="text-sm text-[#FF9900] font-semibold tracking-wider uppercase">STAR47</p>
              <h1 className="text-3xl font-bold text-gray-900 mt-1">{design.name}</h1>
              <div className="flex items-center space-x-3 mt-2">
                <p className="text-3xl font-bold text-gray-900">${product.price.toFixed(2)}</p>
                <p className="text-sm text-gray-400 line-through">${(product.price * 1.2).toFixed(2)}</p>
                <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-sm font-medium">
                  20% off
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Duties and taxes included.</p>
            </div>

            {/* Description */}
            <div className="border-t border-b border-gray-100 py-4">
              <p className="text-gray-600 leading-relaxed">{design.description}</p>
            </div>

            {/* Features */}
            <div className="space-y-1 text-sm text-gray-600">
              {detailsArray.map((line, i) => (
                <p key={i} className="flex items-start space-x-2">
                  <span className="text-[#FF9900] mt-0.5">•</span>
                  <span>{line.replace('• ', '')}</span>
                </p>
              ))}
            </div>

            {/* Size Selection */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="font-semibold text-gray-900">Select Size</label>
                <button className="text-sm text-[#FF9900] hover:text-[#e68900] transition-colors">
                  Size Guide
                </button>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {SIZES.map(size => (
                  <button
                    key={size.id}
                    className={`py-3 px-4 rounded-lg border-2 text-center transition-all duration-200 ${
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

            {/* Quantity */}
            <div>
              <label className="font-semibold text-gray-900 block mb-3">Quantity</label>
              <div className="flex items-center space-x-4">
                <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 hover:bg-gray-100 transition-colors"
                  >
                    <Minus size={18} />
                  </button>
                  <span className="px-6 py-2 font-semibold text-lg min-w-[50px] text-center">
                    {quantity}
                  </span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 hover:bg-gray-100 transition-colors"
                  >
                    <Plus size={18} />
                  </button>
                </div>
                <p className="text-sm text-gray-500">
                  {quantity > 1 ? `${quantity} items` : '1 item'}
                </p>
              </div>
            </div>

            {/* Add to Cart */}
            <button 
              onClick={handleAddToCart}
              className="w-full bg-[#FF9900] hover:bg-[#e68900] text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-2 shadow-lg shadow-[#FF9900]/25"
            >
              <ShoppingBag size={20} />
              <span>Add to Cart - ${(product.price * quantity).toFixed(2)}</span>
            </button>

            {/* View Cart Button - Shows after adding items */}
            <Link to="/checkout">
              <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-8 rounded-lg transition-colors flex items-center justify-center space-x-2">
                <ShoppingBag size={18} />
                <span>View Cart</span>
              </button>
            </Link>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Truck size={18} className="text-[#FF9900]" />
                <span>Free Shipping</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <RotateCcw size={18} className="text-[#FF9900]" />
                <span>Easy Returns</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Shield size={18} className="text-[#FF9900]" />
                <span>Secure Checkout</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">You Might Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {/* Add related products here */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Fashion;