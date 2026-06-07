import React from 'react';
import Checkout from './pages/Checkout';
import AdminDashboard from './pages/AdminDashboard';
import './App.css';

function App() {
  // Check if URL has /admin
  const isAdmin = window.location.pathname === '/admin';
  
  // If on admin page, show admin dashboard without the store header
  if (isAdmin) {
    return <AdminDashboard />;
  }
  
  // Otherwise show the store frontend
  return (
    <div className="App">
      <header className="App-header">
        <div className="header-container">
          {/* Your Logo - Fixed/Constant */}
          <div className="logo-section">
            <img 
              src="/images/logo.jpg" 
              alt="STAR47" 
              className="header-logo"
            />
          </div>
          
          {/* Moving Text - Pre Order Now! */}
          <div className="moving-text-container">
            <div className="moving-text">
              <span>🔥 PRE ORDER NOW! 🔥</span>
              <span>✨ LIMITED EDITION ✨</span>
              <span>⚡ STAR47 ⚡</span>
              <span>🎯 PRE ORDER NOW! 🎯</span>
              <span>💫 EXCLUSIVE DROP 💫</span>
              <span>🔥 PRE ORDER NOW! 🔥</span>
            </div>
          </div>
        </div>
      </header>
      <Checkout />
    </div>
  );
}

export default App;