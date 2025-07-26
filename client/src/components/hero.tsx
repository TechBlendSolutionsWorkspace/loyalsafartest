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
          <div className="text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-slide-up">
              Premium Digital Services at{' '}
              <span className="text-yellow-300">Affordable Prices</span>
            </h1>
            <p className="text-xl mb-8 text-blue-100 animate-slide-up">
              Access Netflix, Prime, Disney+, AI tools, software licenses, and more at unbeatable prices. Genuine access, instant delivery.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-slide-up">
              <Link href="/products">
                <Button className="bg-white text-gray-900 px-8 py-4 text-lg font-semibold hover:bg-gray-100 transition-colors">
                  Explore Products
                </Button>
              </Link>
              <Button 
                onClick={scrollToProducts}
                variant="outline"
                className="border-2 border-white text-white px-8 py-4 text-lg font-semibold hover:bg-white hover:text-gray-900 transition-colors bg-transparent"
              >
                Learn More
              </Button>
            </div>
            
            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-6 mt-12">
              <div className="flex items-center text-blue-100">
                <Shield className="h-8 w-8 text-green-400 mr-2" />
                <span>Safe Payment</span>
              </div>
              <div className="flex items-center text-blue-100">
                <Award className="h-8 w-8 text-blue-400 mr-2" />
                <span>Genuine Access</span>
              </div>
              <div className="flex items-center text-blue-100">
                <Rocket className="h-8 w-8 text-purple-400 mr-2" />
                <span>Fast Delivery</span>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="relative z-10">
              <img 
                src="https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Modern digital workspace with multiple screens" 
                className="rounded-xl shadow-2xl w-full h-auto"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 w-full h-full bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
