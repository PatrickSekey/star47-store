import React, { useState } from 'react';
import { Star, ShoppingCart, Heart } from 'lucide-react';

const ProductCard = ({ product }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden group">
      {/* Product Image */}
      <div className="relative overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Discount Badge */}
        {product.discount && (
          <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-bold">
            {product.discount}% OFF
          </span>
        )}
        
        {/* Wishlist Button */}
        <button 
          onClick={() => setIsWishlisted(!isWishlisted)}
          className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
        >
          <Heart 
            size={20} 
            className={isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400'}
          />
        </button>
        
        {/* Quick View Button - Appears on hover */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/70 to-transparent p-4">
          <button className="w-full bg-white text-gray-800 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Quick View
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Brand/Category */}
        <p className="text-xs text-gray-500 uppercase tracking-wider">{product.brand}</p>
        
        {/* Product Name */}
        <h3 className="text-lg font-semibold text-gray-800 mt-1 line-clamp-2">
          {product.name}
        </h3>
        
        {/* Rating */}
        <div className="flex items-center mt-2">
          <div className="flex items-center bg-green-600 text-white px-2 py-0.5 rounded text-sm">
            {product.rating} <Star size={14} className="ml-1 fill-current" />
          </div>
          <span className="text-gray-400 text-sm ml-2">({product.reviews} reviews)</span>
        </div>

        {/* Price */}
        <div className="mt-2 flex items-baseline space-x-2">
          <span className="text-2xl font-bold text-gray-900">
            ₹{product.price}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-gray-400 line-through">
              ₹{product.originalPrice}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button className="w-full mt-3 bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2">
          <ShoppingCart size={18} />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;