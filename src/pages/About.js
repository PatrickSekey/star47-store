import React from 'react';

const About = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-10 rounded-2xl shadow-2xl max-w-4xl w-full">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">About Us</h1>
        <p className="text-gray-600 text-lg mb-4">
          Welcome to our About page! We're building amazing web experiences with React and Tailwind CSS.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-bold text-blue-600">Our Mission</h3>
            <p className="text-gray-600">To create beautiful, fast, and accessible web applications.</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-bold text-purple-600">Our Vision</h3>
            <p className="text-gray-600">To empower developers with modern tools and best practices.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;