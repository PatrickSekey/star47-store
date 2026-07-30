import React from 'react';

const Services = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-10 rounded-2xl shadow-2xl max-w-4xl w-full">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Our Services</h1>
        <p className="text-gray-600 text-lg mb-6">
          Here are the services we offer to help you build better applications.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-gray-200 p-6 rounded-lg hover:shadow-lg transition-shadow">
            <div className="text-3xl mb-2">🚀</div>
            <h3 className="font-bold text-xl mb-2">Web Development</h3>
            <p className="text-gray-600">Modern, responsive web applications built with React.</p>
          </div>
          <div className="border border-gray-200 p-6 rounded-lg hover:shadow-lg transition-shadow">
            <div className="text-3xl mb-2">🎨</div>
            <h3 className="font-bold text-xl mb-2">UI/UX Design</h3>
            <p className="text-gray-600">Beautiful, intuitive designs with Tailwind CSS.</p>
          </div>
          <div className="border border-gray-200 p-6 rounded-lg hover:shadow-lg transition-shadow">
            <div className="text-3xl mb-2">📱</div>
            <h3 className="font-bold text-xl mb-2">Mobile Apps</h3>
            <p className="text-gray-600">Cross-platform mobile applications with React Native.</p>
          </div>
          <div className="border border-gray-200 p-6 rounded-lg hover:shadow-lg transition-shadow">
            <div className="text-3xl mb-2">☁️</div>
            <h3 className="font-bold text-xl mb-2">Cloud Services</h3>
            <p className="text-gray-600">Scalable cloud solutions and deployment strategies.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;