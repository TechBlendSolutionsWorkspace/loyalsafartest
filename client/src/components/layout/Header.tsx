import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Menu, X, Search, ShoppingBag, Heart, User, Diamond } from 'lucide-react';
import { Button } from '../ui/button';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigationItems = [
    { href: '/rings', label: 'Rings' },
    { href: '/necklaces', label: 'Necklaces' },
    { href: '/bracelets', label: 'Bracelets' },
    { href: '/earrings', label: 'Earrings' },
    { href: '/collections', label: 'Collections' },
    { href: '/custom', label: 'Bespoke' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-black/95 backdrop-blur-xl border-b border-amber-500/20 shadow-2xl' 
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-r from-amber-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <Diamond className="h-5 w-5 text-black" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
                LuxeJewels
              </h1>
              <p className="text-xs text-gray-400 -mt-1">Where Elegance Meets Innovation</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link 
                key={item.href} 
                href={item.href}
                className={`text-white hover:text-amber-400 transition-colors font-medium relative group ${
                  location === item.href ? 'text-amber-400' : ''
                }`}
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-400 to-yellow-500 group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white hover:text-amber-400 hover:bg-amber-500/10"
              data-testid="button-search"
            >
              <Search className="h-5 w-5" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white hover:text-amber-400 hover:bg-amber-500/10 relative"
              data-testid="button-wishlist"
            >
              <Heart className="h-5 w-5" />
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-r from-amber-500 to-yellow-600 text-black text-xs rounded-full flex items-center justify-center font-semibold">
                3
              </span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white hover:text-amber-400 hover:bg-amber-500/10 relative"
              data-testid="button-cart"
            >
              <ShoppingBag className="h-5 w-5" />
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-r from-amber-500 to-yellow-600 text-black text-xs rounded-full flex items-center justify-center font-semibold">
                2
              </span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white hover:text-amber-400 hover:bg-amber-500/10"
              data-testid="button-account"
            >
              <User className="h-5 w-5" />
            </Button>

            <Button 
              className="bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-black font-semibold px-6"
              data-testid="button-book-appointment"
            >
              Book Appointment
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden text-white hover:text-amber-400"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            data-testid="button-mobile-menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden bg-black/95 backdrop-blur-xl border-t border-amber-500/20 absolute top-full left-0 right-0 shadow-2xl">
            <nav className="px-4 py-6 space-y-4">
              {navigationItems.map((item) => (
                <Link 
                  key={item.href} 
                  href={item.href}
                  className="block text-white hover:text-amber-400 transition-colors font-medium py-2 border-b border-gray-800 last:border-b-0"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            
            <div className="px-4 pb-6 pt-2 border-t border-gray-800 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm" className="text-white hover:text-amber-400">
                  <Search className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="sm" className="text-white hover:text-amber-400 relative">
                  <Heart className="h-5 w-5" />
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-amber-500 text-black text-xs rounded-full flex items-center justify-center">3</span>
                </Button>
                <Button variant="ghost" size="sm" className="text-white hover:text-amber-400 relative">
                  <ShoppingBag className="h-5 w-5" />
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-amber-500 text-black text-xs rounded-full flex items-center justify-center">2</span>
                </Button>
                <Button variant="ghost" size="sm" className="text-white hover:text-amber-400">
                  <User className="h-5 w-5" />
                </Button>
              </div>
              
              <Button className="bg-gradient-to-r from-amber-500 to-yellow-600 text-black font-semibold">
                Book Now
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};