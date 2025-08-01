import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Shield, Award, Rocket } from "lucide-react";

export default function Hero() {
  const scrollToProducts = () => {
    const element = document.getElementById('products');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="gradient-bg py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="text-white text-center md:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-slide-up leading-tight">
              Premium Digital Services at{' '}
              <span className="text-yellow-300">Unbeatable Prices</span>
            </h1>
            <p className="text-lg sm:text-xl mb-8 text-blue-100 animate-slide-up leading-relaxed">
              Authentic subscriptions for Netflix, Prime Video, Disney+ Hotstar, Sony LIV, Surfshark VPN, Google Cloud Storage & more. 
              <span className="block mt-2 text-base text-yellow-200 font-semibold">100% Genuine • Instant Delivery • Trusted by 10,000+ Customers</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-slide-up justify-center md:justify-start">
              <Link href="/products" className="w-full sm:w-auto">
                <Button className="bg-white text-gray-900 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold hover:bg-gray-100 transition-colors w-full sm:w-auto">
                  Explore Products
                </Button>
              </Link>
              <Button 
                onClick={scrollToProducts}
                variant="outline"
                className="border-2 border-white text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold hover:bg-white hover:text-gray-900 transition-colors bg-transparent w-full sm:w-auto"
              >
                Learn More
              </Button>
            </div>
            
            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-4 sm:gap-6 mt-8 sm:mt-12 justify-center md:justify-start">
              <div className="flex items-center text-blue-100 text-sm sm:text-base bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm border border-white/20">
                <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-green-400 mr-2" />
                <span className="font-semibold">SSL Secured</span>
              </div>
              <div className="flex items-center text-blue-100 text-sm sm:text-base bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm border border-white/20">
                <Award className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400 mr-2" />
                <span className="font-semibold">100% Authentic</span>
              </div>
              <div className="flex items-center text-blue-100 text-sm sm:text-base bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm border border-white/20">
                <Rocket className="h-5 w-5 sm:h-6 sm:w-6 text-purple-400 mr-2" />
                <span className="font-semibold">Instant Delivery</span>
              </div>
            </div>
            
            {/* Brand Showcase */}
            <div className="mt-8 sm:mt-12">
              <p className="text-blue-200 text-sm mb-4 font-medium">Authorized for Premium Brands</p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start items-center">
                <div className="flex items-center space-x-2 text-white/90">
                  <i className="fas fa-play text-red-600 text-xl"></i>
                  <span className="text-sm font-semibold">Netflix</span>
                </div>
                <div className="flex items-center space-x-2 text-white/90">
                  <i className="fas fa-video text-blue-400 text-xl"></i>
                  <span className="text-sm font-semibold">Prime Video</span>
                </div>
                <div className="flex items-center space-x-2 text-white/90">
                  <i className="fas fa-magic text-purple-400 text-xl"></i>
                  <span className="text-sm font-semibold">Disney+</span>
                </div>
                <div className="flex items-center space-x-2 text-white/90">
                  <i className="fas fa-shield-alt text-blue-400 text-xl"></i>
                  <span className="text-sm font-semibold">VPN</span>
                </div>
                <div className="flex items-center space-x-2 text-white/90">
                  <i className="fab fa-google text-yellow-400 text-xl"></i>
                  <span className="text-sm font-semibold">Google</span>
                </div>
                <div className="flex items-center space-x-2 text-white/90">
                  <i className="fab fa-spotify text-green-400 text-xl"></i>
                  <span className="text-sm font-semibold">Spotify</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="relative z-10">
              <img 
                src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Secure digital services and premium subscriptions dashboard" 
                className="rounded-xl shadow-2xl w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-xl"></div>
              {/* Trust Badge Overlay */}
              <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                <i className="fas fa-shield-check mr-1"></i>
                Verified
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
