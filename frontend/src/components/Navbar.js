import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, Search, ShoppingCart, MapPin, ChevronDown } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { getCartCount } = useCart(); // Get cart count from context

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
    // Add your search logic here
  };

  const cartCount = getCartCount();

  return (
    <nav className="bg-[#131921] text-white fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center h-16">
          {/* Logo with Image */}
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <img 
              src="/images/logo.jpg" 
              alt="STAR47" 
              className="h-10 w-auto object-contain"
            />
            <span className="text-xl font-bold text-white hidden sm:inline">
              STAR47
            </span>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 mx-4">
            <div className="flex">
              <select className="hidden sm:block bg-gray-100 text-gray-700 px-3 rounded-l-lg border-r border-gray-300 text-sm h-10">
                <option>All</option>
                <option>Electronics</option>
                <option>Fashion</option>
                <option>Home</option>
              </select>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="flex-1 px-4 py-2 text-gray-700 focus:outline-none h-10"
              />
              <button type="submit" className="bg-[#FF9900] hover:bg-[#e68900] px-6 rounded-r-lg transition-colors h-10">
                <Search size={20} className="text-gray-800" />
              </button>
            </div>
          </form>

          {/* Right Side */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="hover:border border-white/30 px-2 py-1 rounded cursor-pointer">
              <span className="text-xs text-gray-300">Hello, sign in</span>
              <div className="text-sm font-bold">Account & Lists</div>
            </div>
            <div className="hover:border border-white/30 px-2 py-1 rounded cursor-pointer">
              <span className="text-xs text-gray-300">Returns</span>
              <div className="text-sm font-bold">& Orders</div>
            </div>
            <Link to="/contact" className="hover:text-[#FF9900] transition-colors">
              Contact
            </Link>
            
            {/* Cart Button with Badge */}
            <Link 
              to="/checkout" 
              className="relative p-2 hover:text-[#FF9900] transition-colors"
            >
              <ShoppingCart size={28} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#FF9900] text-gray-800 text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center animate-pulse-slow">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Menu */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden ml-2 text-white hover:text-[#FF9900]"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-[#232F3E] p-4 border-t border-[#3a4553]">
          <div className="space-y-3">
            <NavLink to="/" onClick={() => setIsOpen(false)} className="block text-white hover:text-[#FF9900] transition-colors">
              Home
            </NavLink>
            <NavLink to="/about" onClick={() => setIsOpen(false)} className="block text-white hover:text-[#FF9900] transition-colors">
              About
            </NavLink>
            <NavLink to="/services" onClick={() => setIsOpen(false)} className="block text-white hover:text-[#FF9900] transition-colors">
              Services
            </NavLink>
            <NavLink to="/contact" onClick={() => setIsOpen(false)} className="block text-white hover:text-[#FF9900] transition-colors">
              Contact
            </NavLink>
            
            {/* Mobile Cart Link */}
            <NavLink 
              to="/checkout" 
              onClick={() => setIsOpen(false)} 
              className="flex items-center justify-between text-white hover:text-[#FF9900] transition-colors border-t border-[#3a4553] pt-3"
            >
              <span>Cart</span>
              {cartCount > 0 && (
                <span className="bg-[#FF9900] text-gray-800 text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </NavLink>
            
            <div className="border-t border-[#3a4553] pt-3">
              <div className="text-sm text-gray-300">Hello, sign in</div>
              <div className="font-bold text-white">Account & Lists</div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;