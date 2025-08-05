import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface StatItem {
  value: string;
  label: string;
  icon: string;
  gradient: string;
  suffix?: string;
}

const stats: StatItem[] = [
  {
    value: "75847",
    label: "Trusted Customers",
    icon: "fas fa-users",
    gradient: "from-blue-600 to-purple-600",
    suffix: "+"
  },
  {
    value: "15",
    label: "Premium Platforms",
    icon: "fas fa-play-circle",
    gradient: "from-green-500 to-teal-600",
    suffix: "+"
  },
  {
    value: "99.9",
    label: "Success Rate",
    icon: "fas fa-shield-alt",
    gradient: "from-orange-500 to-red-500",
    suffix: "%"
  },
  {
    value: "24",
    label: "Live Support",
    icon: "fas fa-headset",
    gradient: "from-pink-500 to-purple-600",
    suffix: "/7"
  }
];

export default function ProfessionalStats() {
  const [animatedValues, setAnimatedValues] = useState<Record<string, number>>({});
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Intersection Observer to trigger animation when component is visible
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isVisible) {
            setIsVisible(true);
            animateCounters();
          }
        });
      },
      { threshold: 0.3 }
    );

    const element = document.getElementById('professional-stats');
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  const animateCounters = () => {
    stats.forEach((stat, index) => {
      const target = parseFloat(stat.value);
      let current = 0;
      const duration = 2000; // 2 seconds
      const stepTime = 16; // ~60fps
      const steps = duration / stepTime;
      const increment = target / steps;
      
      // Staggered animation start
      setTimeout(() => {
        const counter = setInterval(() => {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(counter);
          }
          setAnimatedValues(prev => ({
            ...prev,
            [stat.label]: Math.floor(current)
          }));
        }, stepTime);
      }, index * 200); // 200ms delay between each counter
    });

    // Add live increment effect every 5 seconds for "Trusted Customers"
    const liveIncrement = setInterval(() => {
      setAnimatedValues(prev => ({
        ...prev,
        'Trusted Customers': (prev['Trusted Customers'] || 0) + Math.floor(Math.random() * 3) + 1
      }));
    }, 5000);

    return () => clearInterval(liveIncrement);
  };

  return (
    <section id="professional-stats" className="py-16 section-gradient">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Trusted by Thousands Worldwide
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Join the growing community of satisfied customers who trust MTS Digital Services
          </p>
          <div className="flex items-center justify-center mt-4 space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-green-600 dark:text-green-400 font-medium">Live Counter</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <Card key={stat.label} className="business-card text-center group animate-slide-up" 
                  style={{ animationDelay: `${index * 0.1}s` }}>
              <CardContent className="p-6">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${stat.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <i className={`${stat.icon} text-2xl text-white`}></i>
                </div>
                <div className="mb-2 relative">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">
                    {(animatedValues[stat.label] || 0).toLocaleString()}
                    {stat.suffix}
                  </span>
                  {stat.label === 'Trusted Customers' && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  )}
                </div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.label}
                </p>
                <Badge variant="secondary" className="mt-2 opacity-75">
                  Growing
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}