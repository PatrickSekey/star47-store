import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import CategoryBar from '../components/CategoryBar';
import { ShoppingCart, TrendingUp, Truck, Shield, ArrowRight } from 'lucide-react';

// Sample product data
const products = [
  {
    id: 1,
    name: 'iPhone 15 Pro Max - 256GB',
    brand: 'Apple',
    price: 149900,
    originalPrice: 159900,
    rating: 4.8,
    reviews: 2345,
    discount: 7,
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop'
  },
  {
    id: 2,
    name: 'Samsung Galaxy S24 Ultra',
    brand: 'Samsung',
    price: 129999,
    originalPrice: 139999,
    rating: 4.7,
    reviews: 1876,
    discount: 10,
    image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=400&fit=crop'
  },
  {
    id: 3,
    name: 'MacBook Air M3 - 13-inch',
    brand: 'Apple',
    price: 114900,
    originalPrice: 124900,
    rating: 4.9,
    reviews: 3456,
    discount: 8,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop'
  },
  {
    id: 4,
    name: 'Sony WH-1000XM5 Headphones',
    brand: 'Sony',
    price: 29990,
    originalPrice: 34990,
    rating: 4.8,
    reviews: 678,
    discount: 15,
    image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&h=400&fit=crop'
  },
  {
    id: 5,
    name: 'Dell XPS 15 - Laptop',
    brand: 'Dell',
    price: 149990,
    originalPrice: 169990,
    rating: 4.6,
    reviews: 987,
    discount: 12,
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&h=400&fit=crop'
  },
  {
    id: 6,
    name: 'iPad Pro M2 - 11-inch',
    brand: 'Apple',
    price: 79900,
    originalPrice: 89900,
    rating: 4.8,
    reviews: 1234,
    discount: 11,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop'
  }
];

// Fashion products data with correct image paths
const fashionProducts = [
  {
    id: 1,
    name: 'Classic Star47 T-Shirt',
    brand: 'STAR47',
    price: 50.00,
    originalPrice: 60.00,
    rating: 4.8,
    reviews: 234,
    discount: 17,
    image: '/images/Shirt1.jpg',
    productType: 'tshirt',
    designId: 1
  },
  {
    id: 2,
    name: 'Galaxy Edition T-Shirt',
    brand: 'STAR47',
    price: 50.00,
    originalPrice: 60.00,
    rating: 4.7,
    reviews: 187,
    discount: 17,
    image: '/images/Shirt2.jpg',
    productType: 'tshirt',
    designId: 2
  },
  {
    id: 3,
    name: 'Minimalist T-Shirt',
    brand: 'STAR47',
    price: 50.00,
    originalPrice: 60.00,
    rating: 4.9,
    reviews: 156,
    discount: 17,
    image: '/images/shirt3.jpg',
    productType: 'tshirt',
    designId: 3
  },
  {
    id: 4,
    name: 'Classic Star47 Hoodie',
    brand: 'STAR47',
    price: 75.00,
    originalPrice: 90.00,
    rating: 4.9,
    reviews: 456,
    discount: 17,
    image: '/images/Hoodie1.jpg',
    productType: 'hoodie',
    designId: 1
  },
  {
    id: 5,
    name: 'Constellation Hoodie',
    brand: 'STAR47',
    price: 75.00,
    originalPrice: 90.00,
    rating: 4.8,
    reviews: 345,
    discount: 17,
    image: '/images/Hoodie2.jpg',
    productType: 'hoodie',
    designId: 2
  }
];

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <CategoryBar />
      
      {/* Hero Banner */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
          <h2 className="text-3xl font-bold">🔥 Big Sale!</h2>
          <p className="text-lg opacity-90">Up to 70% off on electronics</p>
          <button className="mt-4 bg-white text-blue-600 px-6 py-2 rounded-lg font-bold hover:shadow-lg transition-shadow">
            Shop Now
          </button>
        </div>
      </div>

      {/* Quick Features */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { icon: ShoppingCart, label: 'Free Delivery' },
            { icon: TrendingUp, label: 'Best Prices' },
            { icon: Truck, label: 'Fast Shipping' },
            { icon: Shield, label: 'Secure Payment' }
          ].map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="bg-white p-4 rounded-lg shadow-sm flex items-center space-x-3">
                <Icon className="text-blue-600" size={24} />
                <span className="text-sm font-medium">{feature.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Fashion Products Section */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Fashion Collection</h2>
            <p className="text-sm text-gray-500">Premium clothing from STAR47</p>
          </div>
          <Link to="/services" className="text-blue-600 hover:text-blue-800 font-semibold flex items-center space-x-1">
            <span>View All</span>
            <ArrowRight size={18} />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {fashionProducts.map(product => (
            <Link 
              key={product.id} 
              to={`/fashion/${product.productType}/${product.designId}`}
              className="bg-white rounded-lg shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden group"
            >
              <div className="relative overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {product.discount && (
                  <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-bold">
                    {product.discount}% OFF
                  </span>
                )}
              </div>
              <div className="p-4">
                <p className="text-xs text-gray-500 uppercase tracking-wider">{product.brand}</p>
                <h3 className="text-lg font-semibold text-gray-800 mt-1 line-clamp-2">
                  {product.name}
                </h3>
                <div className="flex items-center mt-2">
                  <div className="flex items-center bg-green-600 text-white px-2 py-0.5 rounded text-sm">
                    {product.rating} <span className="ml-1">★</span>
                  </div>
                  <span className="text-gray-400 text-sm ml-2">({product.reviews})</span>
                </div>
                <div className="mt-2 flex items-baseline space-x-2">
                  <span className="text-xl font-bold text-gray-900">
                    ${product.price.toFixed(2)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-400 line-through">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
                <button className="w-full mt-3 bg-[#FF9900] hover:bg-[#e68900] text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                  View Details
                </button>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Electronics Products Section */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Electronics</h2>
            <p className="text-sm text-gray-500">Latest gadgets and tech</p>
          </div>
          <button className="text-blue-600 hover:text-blue-800 font-semibold flex items-center space-x-1">
            <span>View All</span>
            <ArrowRight size={18} />
          </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;