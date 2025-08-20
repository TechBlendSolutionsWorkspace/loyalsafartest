import React from 'react';
import { Link } from 'wouter';
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const categories = [
    { name: 'Engagement Rings', href: '/products?category=rings&type=engagement' },
    { name: 'Wedding Bands', href: '/products?category=rings&type=wedding' },
    { name: 'Diamond Necklaces', href: '/products?category=necklaces&material=diamond' },
    { name: 'Gold Bracelets', href: '/products?category=bracelets&material=gold' },
    { name: 'Pearl Earrings', href: '/products?category=earrings&material=pearl' },
    { name: 'Custom Jewelry', href: '/products?category=custom' },
  ];

  const customerService = [
    { name: 'Contact Us', href: '/contact' },
    { name: 'Size Guide', href: '/size-guide' },
    { name: 'Care Instructions', href: '/care' },
    { name: 'Returns & Exchanges', href: '/returns' },
    { name: 'Shipping Info', href: '/shipping' },
    { name: 'Warranty', href: '/warranty' },
  ];

  const company = [
    { name: 'About Us', href: '/about' },
    { name: 'Our Story', href: '/story' },
    { name: 'Careers', href: '/careers' },
    { name: 'Press', href: '/press' },
    { name: 'Sustainability', href: '/sustainability' },
    { name: 'Privacy Policy', href: '/privacy' },
  ];

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600">
        <div className="container-luxury py-12">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-black mb-4">
              Stay Updated with Luxury
            </h3>
            <p className="text-black/80 mb-6 max-w-2xl mx-auto">
              Be the first to know about new collections, exclusive offers, and jewelry care tips.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg border-0 bg-white/90 text-black placeholder-gray-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button className="px-8 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container-luxury py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                <span className="text-black font-bold text-sm">L</span>
              </div>
              <span className="text-xl font-bold text-gold-gradient">LuxeJewels</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Crafting exquisite jewelry with passion and precision since 1985. 
              Every piece tells a story of elegance, quality, and timeless beauty.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-yellow-500 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-yellow-500 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-yellow-500 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Categories
            </h4>
            <ul className="space-y-3">
              {categories.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-600 dark:text-gray-400 hover:text-yellow-500 transition-colors text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Customer Service
            </h4>
            <ul className="space-y-3">
              {customerService.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-600 dark:text-gray-400 hover:text-yellow-500 transition-colors text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Contact Info
            </h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm">
                <MapPin className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-400">
                  123 Luxury Ave, Diamond District, NY 10001
                </span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Phone className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-400">
                  +1 (555) 123-4567
                </span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Mail className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-400">
                  hello@luxejewels.com
                </span>
              </div>
            </div>

            {/* Store Hours */}
            <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <h5 className="font-semibold text-sm text-gray-900 dark:text-white mb-2">
                Store Hours
              </h5>
              <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                <div>Mon - Fri: 10am - 8pm</div>
                <div>Saturday: 10am - 6pm</div>
                <div>Sunday: 12pm - 5pm</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-200 dark:border-gray-800">
        <div className="container-luxury py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              © 2024 LuxeJewels. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <Link href="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-yellow-500 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-600 dark:text-gray-400 hover:text-yellow-500 transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-gray-600 dark:text-gray-400 hover:text-yellow-500 transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}