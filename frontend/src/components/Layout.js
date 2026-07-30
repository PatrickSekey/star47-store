import React from 'react';
import Navbar from './Navbar';
// ❌ REMOVE THIS: import CategoryBar from './CategoryBar';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      {/* ❌ REMOVE THIS: <CategoryBar /> */}
      <main className="flex-grow pt-16">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;