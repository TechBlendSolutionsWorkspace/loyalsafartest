import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import { Sun, Moon, ShoppingCart, Menu, X } from "lucide-react";

export default function Header() {
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-background/95 shadow-lg sticky top-0 z-50 backdrop-blur-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 gradient-bg rounded-lg flex items-center justify-center">
                <i className="fas fa-digital-tachograph text-white text-lg"></i>
              </div>
              <span className="text-xl font-bold text-foreground">MTS Digital Services</span>
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            {location === '/' ? (
              <>
                <button 
                  onClick={() => scrollToSection('home')}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Home
                </button>
                <button 
                  onClick={() => scrollToSection('products')}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Products
                </button>
                <button 
                  onClick={() => scrollToSection('about')}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  About
                </button>
                <button 
                  onClick={() => scrollToSection('blog')}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Blog
                </button>
                <button 
                  onClick={() => scrollToSection('contact')}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Contact
                </button>
              </>
            ) : (
              <>
                <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Home
                </Link>
                <Link href="/products" className="text-muted-foreground hover:text-primary transition-colors">
                  Products
                </Link>
                <Link href="/#about" className="text-muted-foreground hover:text-primary transition-colors">
                  About
                </Link>
                <Link href="/#blog" className="text-muted-foreground hover:text-primary transition-colors">
                  Blog
                </Link>
                <Link href="/#contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </Link>
              </>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <div className="flex items-center">
              <Sun className="h-4 w-4 text-yellow-500 mr-2" />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                className="w-12 h-6 p-0 relative"
              >
                <div className={`absolute inset-0 rounded-full transition-colors ${
                  theme === "dark" ? "bg-primary" : "bg-gray-300"
                }`}>
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform duration-300 absolute top-0.5 ${
                    theme === "dark" ? "translate-x-6" : "translate-x-0.5"
                  }`} />
                </div>
              </Button>
              <Moon className="h-4 w-4 text-gray-600 ml-2" />
            </div>
            
            <Button className="hidden md:flex">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Cart (0)
            </Button>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t py-4">
            <nav className="flex flex-col space-y-4">
              <button 
                onClick={() => scrollToSection('home')}
                className="text-muted-foreground hover:text-primary transition-colors text-left"
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection('products')}
                className="text-muted-foreground hover:text-primary transition-colors text-left"
              >
                Products
              </button>
              <button 
                onClick={() => scrollToSection('about')}
                className="text-muted-foreground hover:text-primary transition-colors text-left"
              >
                About
              </button>
              <button 
                onClick={() => scrollToSection('blog')}
                className="text-muted-foreground hover:text-primary transition-colors text-left"
              >
                Blog
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className="text-muted-foreground hover:text-primary transition-colors text-left"
              >
                Contact
              </button>
              <Button className="w-fit">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Cart (0)
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
