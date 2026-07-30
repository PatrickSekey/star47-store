import React, { useState } from 'react';
import { ChevronDown, Menu, X, ChevronRight, User, Settings, HelpCircle, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';

const CategoryBar = () => {
  const [isAllMenuOpen, setIsAllMenuOpen] = useState(false);

  const categories = [
    'Fresh',
    'Sell',
    "Today's Deals",
    'Mobile',
    'New Releases',
    'Electronics',
    'Customer Service',
    'Home & Kitchen',
    'Fashion',
    'Computers',
    'Toys & Games'
  ];

  return (
    <>
      <div className="bg-[#232F3E] text-white shadow-sm relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center h-[38px] space-x-3 overflow-x-auto scrollbar-hide">
            {/* All Menu - Clickable */}
            <div 
              onClick={() => setIsAllMenuOpen(!isAllMenuOpen)}
              className="flex items-center space-x-1 bg-white/10 hover:bg-white/20 px-3 py-1 rounded cursor-pointer whitespace-nowrap transition-colors border border-white/20"
            >
              <Menu size={18} />
              <span className="text-sm font-bold">All</span>
            </div>

            {/* Categories */}
            {categories.map((category, index) => (
              <div
                key={index}
                className="text-white/90 hover:text-white hover:bg-white/10 px-3 py-1 rounded cursor-pointer whitespace-nowrap text-sm transition-colors border border-transparent hover:border-white/20"
              >
                {category}
              </div>
            ))}

            {/* Trending */}
            <div className="flex items-center text-sm text-white/90 hover:text-white hover:bg-white/10 px-3 py-1 rounded cursor-pointer whitespace-nowrap transition-colors border border-transparent hover:border-white/20">
              <span>Trending</span>
              <ChevronDown size={14} className="ml-1" />
            </div>
          </div>
        </div>
      </div>

      {/* All Menu Flyout */}
      {isAllMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsAllMenuOpen(false)}
          />
          
          {/* Sidebar Menu */}
          <div className="fixed top-0 left-0 h-full w-80 bg-white shadow-2xl z-50 overflow-y-auto animate-slide-in">
            {/* Header - Hello, sign in with hover animation */}
            <Link 
              to="/login"
              className="bg-[#232F3E] text-white p-4 flex items-center space-x-3 hover:bg-[#2a3a4e] transition-all duration-300 cursor-pointer group"
              onClick={() => setIsAllMenuOpen(false)}
            >
              <div className="bg-white/20 p-2 rounded-full group-hover:scale-110 transition-transform duration-300">
                <User size={20} />
              </div>
              <div className="flex-1">
                <div className="text-sm text-gray-300">Hello, sign in</div>
                <div className="font-bold">Account & Lists</div>
              </div>
              <div className="ml-auto transform group-hover:translate-x-1 transition-transform duration-300">
                <ChevronRight size={20} className="text-gray-400" />
              </div>
            </Link>

            {/* Menu Sections */}
            <div className="py-2">
              {/* Trending Section */}
              <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between border-b border-gray-100">
                <span className="font-medium">Trending</span>
                <ChevronRight size={16} className="text-gray-400" />
              </div>

              {/* Men's Fashion */}
              <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between border-b border-gray-100">
                <span className="font-medium">Men's Fashion</span>
                <ChevronRight size={16} className="text-gray-400" />
              </div>
              <div className="pl-8 py-1 text-sm text-gray-600">
                <div className="py-1 hover:text-blue-600 cursor-pointer">Shirts</div>
                <div className="py-1 hover:text-blue-600 cursor-pointer">T-Shirts</div>
                <div className="py-1 hover:text-blue-600 cursor-pointer">Jeans</div>
                <div className="py-1 hover:text-blue-600 cursor-pointer">Jackets</div>
                <div className="py-1 hover:text-blue-600 cursor-pointer">Shoes</div>
                <div className="py-1 hover:text-blue-600 cursor-pointer">Watches</div>
                <div className="py-1 text-blue-600 font-medium cursor-pointer">See all</div>
              </div>

              {/* Women's Fashion */}
              <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between border-b border-gray-100">
                <span className="font-medium">Women's Fashion</span>
                <ChevronRight size={16} className="text-gray-400" />
              </div>
              <div className="pl-8 py-1 text-sm text-gray-600">
                <div className="py-1 hover:text-blue-600 cursor-pointer">Dresses</div>
                <div className="py-1 hover:text-blue-600 cursor-pointer">Tops</div>
                <div className="py-1 hover:text-blue-600 cursor-pointer">Jeans</div>
                <div className="py-1 hover:text-blue-600 cursor-pointer">Jackets</div>
                <div className="py-1 hover:text-blue-600 cursor-pointer">Shoes</div>
                <div className="py-1 hover:text-blue-600 cursor-pointer">Jewelry</div>
                <div className="py-1 text-blue-600 font-medium cursor-pointer">See all</div>
              </div>

              {/* Programs & Features */}
              <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between border-b border-gray-100">
                <span className="font-medium">Programs & Features</span>
                <ChevronRight size={16} className="text-gray-400" />
              </div>
              <div className="pl-8 py-1 text-sm text-gray-600">
                <div className="py-1 hover:text-blue-600 cursor-pointer">Gift Cards & Mobile Recharges</div>
                <div className="py-1 hover:text-blue-600 cursor-pointer"></div>
                <div className="py-1 hover:text-blue-600 cursor-pointer"></div>
                <div className="py-1 hover:text-blue-600 cursor-pointer">Handloom and Handicrafts</div>
                <div className="py-1 text-blue-600 font-medium cursor-pointer">See all</div>
              </div>

              {/* Help & Settings - At the bottom */}
              <div className="border-t border-gray-200 mt-2 pt-2">
                <Link 
                  to="/account"
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center space-x-3 border-b border-gray-100 transition-colors"
                  onClick={() => setIsAllMenuOpen(false)}
                >
                  <User size={18} className="text-gray-600" />
                  <span>Your Account</span>
                </Link>
                <Link 
                  to="/help"
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center space-x-3 border-b border-gray-100 transition-colors"
                  onClick={() => setIsAllMenuOpen(false)}
                >
                  <HelpCircle size={18} className="text-gray-600" />
                  <span>Customer Service</span>
                </Link>
                <Link 
                  to="/settings"
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center space-x-3 border-b border-gray-100 transition-colors"
                  onClick={() => setIsAllMenuOpen(false)}
                >
                  <Settings size={18} className="text-gray-600" />
                  <span>Settings</span>
                </Link>
                <Link 
                  to="/login"
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center space-x-3 transition-colors"
                  onClick={() => setIsAllMenuOpen(false)}
                >
                  <LogIn size={18} className="text-blue-600" />
                  <span className="text-blue-600 font-medium">Sign in</span>
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default CategoryBar;