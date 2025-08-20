import React, { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { ArrowRight, Star, Shield, Truck, Award, Gem, Crown, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { DiamondRing3D } from '../components/3D/DiamondRing3D';
import { ShimmerBackground } from '../components/3D/ShimmerBackground';

export default function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const luxuryCollections = [
    {
      name: 'Rajwada Engagement Rings',
      description: 'Timeless elegance with masterfully cut diamonds',
      price: 'From ₹4,50,000',
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=400&fit=crop',
      href: '/products?category=rings&type=engagement',
      icon: Gem
    },
    {
      name: 'Maharani Diamond Necklaces',
      description: 'Statement pieces crafted with precision',
      price: 'From ₹3,15,000',
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&h=400&fit=crop',
      href: '/products?category=necklaces&material=diamond',
      icon: Sparkles
    },
    {
      name: 'Kundan Tennis Bracelets',
      description: 'Sophisticated designs for the modern connoisseur',
      price: 'From ₹2,52,000',
      image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&h=400&fit=crop',
      href: '/products?category=bracelets&material=platinum',
      icon: Crown
    },
    {
      name: 'Meenakari Pearl Earrings',
      description: 'Custom-designed luxury for discerning tastes',
      price: 'From ₹1,08,000',
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&h=400&fit=crop',
      href: '/products?category=earrings&material=pearl',
      icon: Star
    }
  ];

  const luxuryFeatures = [
    {
      icon: Shield,
      title: '100% Authenticity',
      description: 'GIA certified diamonds with lifetime authenticity guarantee',
      gradient: 'from-amber-400 to-yellow-500'
    },
    {
      icon: Truck,
      title: 'Secure Delivery',
      description: 'White-glove delivery service with full insurance coverage',
      gradient: 'from-amber-500 to-orange-500'
    },
    {
      icon: Award,
      title: 'Master Craftsmanship',
      description: 'Handcrafted by world-renowned jewelry artisans',
      gradient: 'from-yellow-400 to-amber-500'
    },
    {
      icon: Gem,
      title: 'Lifetime Guarantee',
      description: 'Comprehensive warranty with complimentary maintenance',
      gradient: 'from-amber-400 to-yellow-600'
    }
  ];

  const testimonials = [
    {
      name: 'Priya Sharma',
      text: 'The most beautiful engagement ring! The craftsmanship is exceptional and the service was outstanding.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b372?w=100&h=100&fit=crop&crop=face'
    },
    {
      name: 'Arjun Patel',
      text: 'Perfect anniversary gift. The custom necklace exceeded all expectations. Highly recommend!',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
    },
    {
      name: 'Kavya Reddy',
      text: 'Luxurious quality and stunning designs. The team helped me find the perfect wedding set.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
    }
  ];

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Animated Shimmer Background */}
      <ShimmerBackground />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className={`space-y-6 md:space-y-8 text-center lg:text-left transform transition-all duration-1000 ${
              isLoaded ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'
            }`}>
              <div className="space-y-3 md:space-y-4">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 bg-clip-text text-transparent leading-tight">
                  LuxeJewels
                </h1>
                <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-light text-amber-100 mb-4 md:mb-6">
                  Where Elegance Meets Innovation
                </p>
                <p className="text-sm sm:text-base md:text-lg text-gray-300 max-w-2xl mx-auto lg:mx-0 px-2 lg:px-0">
                  Experience the future of luxury jewelry shopping with our revolutionary 3D visualization technology. 
                  Every piece tells a story of unmatched craftsmanship and timeless beauty.
                </p>
              </div>
              
              <div className="flex flex-col gap-3 sm:gap-4 px-4 sm:px-0 lg:justify-start">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-black font-semibold px-6 sm:px-8 py-4 text-base sm:text-lg shadow-2xl transform transition-all hover:scale-105 min-h-[48px]"
                  data-testid="button-shop-now"
                >
                  Shop Now <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="w-full sm:w-auto border-amber-500 text-amber-400 hover:bg-amber-500 hover:text-black px-6 sm:px-8 py-4 text-base sm:text-lg backdrop-blur-sm min-h-[48px]"
                  data-testid="button-explore-collections"
                >
                  Explore Collections
                </Button>
              </div>
            </div>

            {/* Right Content - 3D Diamond Ring */}
            <div className={`flex justify-center mt-8 lg:mt-0 transform transition-all duration-1000 delay-300 ${
              isLoaded ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'
            }`}>
              <div className="relative w-full max-w-md">
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-yellow-500/20 blur-3xl animate-pulse"></div>
                
                {/* 3D Ring Container */}
                <div className="relative bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-amber-500/30 shadow-2xl mx-4 lg:mx-0">
                  <DiamondRing3D className="hover:scale-105 transition-transform duration-500" />
                  <div className="text-center mt-3 sm:mt-4">
                    <p className="text-amber-400 text-xs sm:text-sm font-light">Touch to rotate • Pinch to zoom</p>
                  </div>
                </div>
                
                {/* Floating Trust Badges */}
                <div className="absolute -top-2 -left-2 sm:-top-4 sm:-left-4 bg-gradient-to-r from-amber-500 to-yellow-600 text-black px-2 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold shadow-lg">
                  ✨ Interactive 3D
                </div>
                <div className="absolute -bottom-2 -right-2 sm:-bottom-4 sm:-right-4 bg-gradient-to-r from-amber-500 to-yellow-600 text-black px-2 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold shadow-lg">
                  🔒 100% Authentic
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-amber-500 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-amber-500 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Luxury Trust Badges */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-amber-500/10 to-yellow-600/10 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {luxuryFeatures.map((feature, index) => (
              <div 
                key={feature.title}
                className={`text-center transform transition-all duration-700 delay-${index * 100} ${
                  isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
              >
                <div className={`w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-full bg-gradient-to-r ${feature.gradient} flex items-center justify-center shadow-2xl`}>
                  <feature.icon className="h-6 w-6 sm:h-8 sm:w-8 text-black" />
                </div>
                <h3 className="text-base sm:text-xl font-semibold text-amber-400 mb-1 sm:mb-2">{feature.title}</h3>
                <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Signature Collections */}
      <section className="py-20 sm:py-24 lg:py-32 relative">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent mb-3 sm:mb-4">
              Signature Collections
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto px-4 sm:px-0">
              Discover our curated selection of the world's most exquisite jewelry pieces, 
              each crafted to perfection with uncompromising attention to detail.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
            {luxuryCollections.map((collection, index) => (
              <Link key={collection.name} href={collection.href}>
                <Card className={`group bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl border-amber-500/30 hover:border-amber-400/60 transition-all duration-500 cursor-pointer transform hover:-translate-y-1 sm:hover:-translate-y-2 hover:shadow-2xl ${
                  isLoaded ? 'opacity-100' : 'opacity-0'
                } transition-opacity delay-${index * 200}`}>
                  <CardContent className="p-0 overflow-hidden rounded-lg">
                    <div className="relative h-64 sm:h-72 lg:h-80">
                      <img 
                        src={collection.image} 
                        alt={collection.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                      
                      {/* Floating Icon */}
                      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-full flex items-center justify-center shadow-lg">
                        <collection.icon className="h-4 w-4 sm:h-6 sm:w-6 text-black" />
                      </div>
                      
                      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-1 sm:mb-2 group-hover:text-amber-400 transition-colors">
                          {collection.name}
                        </h3>
                        <p className="text-gray-300 mb-2 sm:mb-3 text-sm sm:text-base">{collection.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-amber-400 font-semibold text-base sm:text-lg">{collection.price}</span>
                          <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-amber-400 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* VIP Experience Section */}
      <section className="py-20 sm:py-24 lg:py-32 bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent mb-3 sm:mb-4">
              VIP Gold Club
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto px-4 sm:px-0">
              Join our exclusive membership program and unlock extraordinary privileges, 
              personalized services, and access to limited edition collections.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            <div className="text-center p-6 sm:p-8 bg-gradient-to-br from-amber-500/10 to-yellow-600/10 backdrop-blur-xl rounded-2xl border border-amber-500/20">
              <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-full flex items-center justify-center">
                <Crown className="h-6 w-6 sm:h-8 sm:w-8 text-black" />
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-amber-400 mb-3 sm:mb-4">Exclusive Access</h3>
              <p className="text-gray-300 text-sm sm:text-base">Be the first to discover our latest collections and limited edition pieces before they go public.</p>
            </div>
            
            <div className="text-center p-6 sm:p-8 bg-gradient-to-br from-amber-500/10 to-yellow-600/10 backdrop-blur-xl rounded-2xl border border-amber-500/20">
              <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-full flex items-center justify-center">
                <Star className="h-6 w-6 sm:h-8 sm:w-8 text-black" />
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-amber-400 mb-3 sm:mb-4">Personal Concierge</h3>
              <p className="text-gray-300 text-sm sm:text-base">Dedicated jewelry consultant for personalized recommendations and styling advice.</p>
            </div>
            
            <div className="text-center p-6 sm:p-8 bg-gradient-to-br from-amber-500/10 to-yellow-600/10 backdrop-blur-xl rounded-2xl border border-amber-500/20">
              <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-full flex items-center justify-center">
                <Gem className="h-6 w-6 sm:h-8 sm:w-8 text-black" />
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-amber-400 mb-3 sm:mb-4">Priority Services</h3>
              <p className="text-gray-300 text-sm sm:text-base">Fast-track delivery, priority customer service, and complimentary jewelry care services.</p>
            </div>
          </div>

          <div className="text-center mt-8 sm:mt-12 px-4 sm:px-0">
            <Button 
              size="lg"
              className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-black font-semibold px-8 sm:px-12 py-4 text-lg sm:text-xl shadow-2xl transform hover:scale-105 transition-all min-h-[48px]"
              data-testid="button-join-vip"
            >
              Join VIP Gold Club - ₹50,000/year
            </Button>
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="py-32 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent mb-4">
              What Our Clients Say
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Real stories from our valued customers who trust us with their most precious moments.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={testimonial.name} className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl border-amber-500/30 p-8">
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-center space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-gray-300 italic text-center">
                    "{testimonial.text}"
                  </p>
                  <div className="flex items-center justify-center space-x-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-amber-500"
                    />
                    <div className="text-center">
                      <p className="font-semibold text-amber-400">{testimonial.name}</p>
                      <p className="text-sm text-gray-400">Verified Customer</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}