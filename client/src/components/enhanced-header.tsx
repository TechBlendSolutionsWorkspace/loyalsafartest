import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X, ChevronDown, Star, Shield, Zap } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function EnhancedHeader() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigation = [
    { name: "Home", href: "/", icon: "fas fa-home" },
    { name: "OTT Services", href: "/category/ott", icon: "fas fa-play-circle" },
    { name: "VPN Security", href: "/category/vpn", icon: "fas fa-shield-alt" },
    { name: "Cloud Storage", href: "/category/cloud", icon: "fas fa-cloud" },
    { name: "Streaming", href: "/category/streaming", icon: "fas fa-music" }
  ];

  const isActive = (href: string) => location === href;

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg border-b border-gray-200/50 dark:border-gray-700/50' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <i className="fas fa-bolt text-white text-lg"></i>
            </div>
            <div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">MTS Digital</span>
              <div className="flex items-center space-x-1">
                <Badge variant="secondary" className="text-xs px-2 py-0">Premium</Badge>
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-current" />
                  ))}
                </div>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigation.map((item) => (
              <Link key={item.name} href={item.href}>
                <Button
                  variant={isActive(item.href) ? "default" : "ghost"}
                  className={`group relative overflow-hidden ${
                    isActive(item.href) 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <i className={`${item.icon} mr-2 text-sm`}></i>
                  {item.name}
                  {isActive(item.href) && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white animate-glow"></div>
                  )}
                </Button>
              </Link>
            ))}
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {/* Professional Features Badge */}
            <div className="hidden md:flex items-center space-x-2 text-sm">
              <Shield className="w-4 h-4 text-green-500" />
              <span className="text-gray-600 dark:text-gray-400">Secure</span>
              <Zap className="w-4 h-4 text-yellow-500" />
              <span className="text-gray-600 dark:text-gray-400">Instant</span>
            </div>

            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <span className="hidden md:block text-sm text-gray-600 dark:text-gray-400">
                  Welcome, {(user as any)?.firstName || (user as any)?.email || 'User'}
                </span>
                <Link href="/api/admin">
                  <Button variant="outline" size="sm" className="btn-professional">
                    <i className="fas fa-cog mr-2"></i>
                    Admin
                  </Button>
                </Link>
                <Link href="/api/logout">
                  <Button variant="outline" size="sm">
                    Logout
                  </Button>
                </Link>
              </div>
            ) : (
              <Link href="/api/login">
                <Button className="btn-professional">
                  <i className="fas fa-sign-in-alt mr-2"></i>
                  Login
                </Button>
              </Link>
            )}

            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="lg:hidden">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col space-y-4 mt-8">
                  <div className="border-b pb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                        <i className="fas fa-bolt text-white text-sm"></i>
                      </div>
                      <div>
                        <span className="font-bold">MTS Digital</span>
                        <div className="text-xs text-gray-500">Premium Services</div>
                      </div>
                    </div>
                  </div>
                  
                  {navigation.map((item) => (
                    <Link key={item.name} href={item.href}>
                      <Button
                        variant={isActive(item.href) ? "default" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <i className={`${item.icon} mr-3 text-sm`}></i>
                        {item.name}
                      </Button>
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}