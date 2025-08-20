import React from 'react';
import { Header } from '../components/layout/Header';

export default function SimpleHomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative py-20 px-4">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-yellow-300/20 blur-3xl"></div>
          
          <div className="relative max-w-7xl mx-auto text-center">
            <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
              LuxeJewels
            </h1>
            
            <p className="text-2xl md:text-3xl mb-8 text-gray-300 font-light">
              Where Elegance Meets Innovation
            </p>
            
            <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-r from-amber-400 to-yellow-300 rounded-full flex items-center justify-center text-6xl animate-pulse">
              💎
            </div>
            
            <p className="text-xl mb-12 text-gray-400 max-w-2xl mx-auto">
              Experience the future of luxury jewelry shopping with our immersive 3D showcase and premium collections crafted for the discerning connoisseur.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button className="px-8 py-4 bg-gradient-to-r from-amber-400 to-yellow-300 text-black font-semibold rounded-lg hover:from-amber-500 hover:to-yellow-400 transition-all duration-300 transform hover:scale-105">
                Explore Collection
              </button>
              <button className="px-8 py-4 border-2 border-amber-400 text-amber-400 font-semibold rounded-lg hover:bg-amber-400 hover:text-black transition-all duration-300">
                Watch Showcase
              </button>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-20 px-4 bg-gradient-to-r from-gray-900 to-black">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">
              Premium Experience
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-8 rounded-xl bg-gradient-to-b from-gray-800 to-gray-900 border border-amber-400/20">
                <div className="text-4xl mb-4">🔄</div>
                <h3 className="text-xl font-semibold mb-4 text-amber-400">360° 3D Viewing</h3>
                <p className="text-gray-400">Interactive 3D models let you examine every detail of our exquisite jewelry pieces.</p>
              </div>
              
              <div className="text-center p-8 rounded-xl bg-gradient-to-b from-gray-800 to-gray-900 border border-amber-400/20">
                <div className="text-4xl mb-4">✨</div>
                <h3 className="text-xl font-semibold mb-4 text-amber-400">Premium Materials</h3>
                <p className="text-gray-400">Only the finest diamonds, precious metals, and gemstones in our collections.</p>
              </div>
              
              <div className="text-center p-8 rounded-xl bg-gradient-to-b from-gray-800 to-gray-900 border border-amber-400/20">
                <div className="text-4xl mb-4">🎨</div>
                <h3 className="text-xl font-semibold mb-4 text-amber-400">Custom Design</h3>
                <p className="text-gray-400">Bespoke jewelry pieces tailored to your unique vision and style.</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* VIP Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">
              VIP Gold Club
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              Join our exclusive membership for early access to limited collections and personalized concierge service.
            </p>
            <button className="px-10 py-4 bg-gradient-to-r from-amber-400 to-yellow-300 text-black font-bold rounded-lg hover:from-amber-500 hover:to-yellow-400 transition-all duration-300 transform hover:scale-105">
              Become a VIP Member
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}