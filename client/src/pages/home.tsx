import { useState, useEffect } from 'react';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simple initialization
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome</h2>
          <p className="text-gray-600">Loading your restaurant website...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <div className="container mx-auto px-6 py-20">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-800 mb-6">
            🍛 Welcome to Your Indian Restaurant
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            A clean, modern foundation ready for your famous Indian restaurant website. 
            All the old e-commerce functionality has been removed.
          </p>
          
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Ready to Build</h2>
            <p className="text-gray-600 mb-6">
              This is your fresh start! The database is clean, all old functionality removed, 
              and you have a modern React + TypeScript foundation ready for your restaurant website.
            </p>
            
            <div className="grid md:grid-cols-3 gap-4 text-left">
              <div className="bg-orange-50 p-4 rounded-lg">
                <h3 className="font-semibold text-orange-800 mb-2">Clean Database</h3>
                <p className="text-orange-600 text-sm">PostgreSQL ready for menu items, reservations, and more</p>
              </div>
              
              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="font-semibold text-red-800 mb-2">Modern Stack</h3>
                <p className="text-red-600 text-sm">React, TypeScript, Tailwind CSS all configured</p>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-semibold text-yellow-800 mb-2">Fresh Start</h3>
                <p className="text-yellow-600 text-sm">No old code, ready for your restaurant features</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}