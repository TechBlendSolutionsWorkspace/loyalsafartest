import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  ShoppingBag, 
  Users, 
  Star, 
  Shield,
  Zap,
  Gift,
  Sparkles
} from "lucide-react";

export default function Welcome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const features = [
    {
      icon: <ShoppingBag className="h-8 w-8 text-blue-500" />,
      title: "Premium Digital Services",
      description: "Access Netflix, Spotify, ChatGPT, and 100+ premium services at affordable prices"
    },
    {
      icon: <Shield className="h-8 w-8 text-green-500" />,
      title: "Secure & Reliable",
      description: "Private login, instant activation, and full warranty on all purchases"
    },
    {
      icon: <Zap className="h-8 w-8 text-yellow-500" />,
      title: "Instant Delivery",
      description: "Get your digital services activated within minutes of purchase"
    },
    {
      icon: <Gift className="h-8 w-8 text-purple-500" />,
      title: "Unbeatable Prices",
      description: "Save up to 50% compared to official pricing with our exclusive deals"
    }
  ];

  const heroSlides = [
    {
      title: "Welcome to MTS Digital Services",
      subtitle: "Your One-Stop Digital Marketplace",
      description: "Discover premium streaming, AI tools, cloud storage, and professional software at unbeatable prices.",
      bgGradient: "from-blue-600 via-purple-600 to-indigo-700"
    },
    {
      title: "Premium Streaming Services",
      subtitle: "Netflix, Amazon Prime, Disney+ & More",
      description: "Enjoy your favorite shows and movies with our authentic streaming subscriptions.",
      bgGradient: "from-red-600 via-pink-600 to-purple-700"
    },
    {
      title: "Professional AI Tools",
      subtitle: "ChatGPT, Claude, Gemini Pro & More",
      description: "Boost your productivity with cutting-edge AI tools and professional software.",
      bgGradient: "from-green-600 via-teal-600 to-blue-700"
    }
  ];

  const stats = [
    { value: "10,000+", label: "Happy Customers" },
    { value: "100+", label: "Premium Services" },  
    { value: "50%", label: "Average Savings" },
    { value: "24/7", label: "Customer Support" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Hero Section with Sliding Background */}
      <section className="relative overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${heroSlides[currentSlide].bgGradient} transition-all duration-1000`} />
        
        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/3 left-1/4 w-20 h-20 bg-white/20 rounded-full blur-xl animate-bounce"></div>
          <div className="absolute bottom-1/3 right-1/4 w-16 h-16 bg-white/20 rounded-full blur-xl animate-bounce delay-500"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-20 text-center text-white">
          <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <Badge className="mb-6 bg-white/20 text-white border-white/30 hover:bg-white/30">
              <Sparkles className="w-4 h-4 mr-2" />
              New: 40+ OTT Platforms Added!
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              {heroSlides[currentSlide].title}
            </h1>
            
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-blue-100">
              {heroSlides[currentSlide].subtitle}
            </h2>
            
            <p className="text-xl md:text-2xl mb-8 text-blue-50 max-w-3xl mx-auto leading-relaxed">
              {heroSlides[currentSlide].description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link href="/">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-semibold shadow-2xl">
                  Explore Products
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              
              <Link href="/admin">
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold">
                  Admin Dashboard
                  <Shield className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-blue-100 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentSlide === index ? 'bg-white scale-125' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Why Choose MTS Digital Services?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              We provide premium digital services with unmatched quality, security, and affordability
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-2xl transition-all duration-300 border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:-translate-y-2">
                <CardContent className="p-8 text-center">
                  <div className="mb-6 transform group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Preview */}
      <section className="py-20 bg-gradient-to-r from-blue-50 to-indigo-100 dark:from-slate-800 dark:to-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Explore Our Categories
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              From streaming services to professional software, we have everything you need
            </p>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              { name: "OTT Streaming", icon: "🎬", count: "40+ Services", color: "from-red-500 to-pink-600" },
              { name: "Professional Software", icon: "💼", count: "33+ Tools", color: "from-blue-500 to-indigo-600" },
              { name: "Streaming Services", icon: "🎵", count: "11+ Platforms", color: "from-green-500 to-teal-600" },
              { name: "Courses", icon: "📚", count: "7+ Courses", color: "from-purple-500 to-violet-600" },
              { name: "Marketing Tools", icon: "📈", count: "4+ Solutions", color: "from-orange-500 to-red-600" },
              { name: "Adult Content", icon: "🔞", count: "4+ Services", color: "from-pink-500 to-rose-600" },
              { name: "Gaming Software", icon: "🎮", count: "Coming Soon", color: "from-cyan-500 to-blue-600" },
              { name: "Web Design", icon: "🎨", count: "Coming Soon", color: "from-indigo-500 to-purple-600" }
            ].map((category, index) => (
              <Link key={index} href={index < 6 ? "/" : "#"}>
                <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm hover:-translate-y-1">
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${category.color} flex items-center justify-center text-2xl mb-4 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                      {category.icon}
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {category.count}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 text-lg font-semibold shadow-lg">
                View All Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4 text-center">
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-green-500" />
              <span className="font-semibold text-gray-700 dark:text-gray-300">Secure Payments</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="h-6 w-6 text-yellow-500" />
              <span className="font-semibold text-gray-700 dark:text-gray-300">5-Star Support</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-6 w-6 text-blue-500" />
              <span className="font-semibold text-gray-700 dark:text-gray-300">10,000+ Customers</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="h-6 w-6 text-purple-500" />
              <span className="font-semibold text-gray-700 dark:text-gray-300">Instant Activation</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}