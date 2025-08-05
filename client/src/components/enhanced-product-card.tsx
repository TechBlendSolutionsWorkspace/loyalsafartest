import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Shield, Zap, Clock, Award } from "lucide-react";
import { Product } from "@shared/schema";
import { ServiceIconComponent } from "@/components/service-icons";

interface EnhancedProductCardProps {
  product: Product;
  onCheckout: (product: Product) => void;
  isAuthenticated: boolean;
}

export default function EnhancedProductCard({ 
  product, 
  onCheckout,
  isAuthenticated 
}: EnhancedProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const discountPercentage = product.originalPrice 
    ? Math.round((1 - product.price / product.originalPrice) * 100) 
    : 0;

  const features = [
    { icon: Shield, text: product.warranty || "Lifetime Support", color: "text-green-500" },
    { icon: Zap, text: product.activationTime || "Instant", color: "text-yellow-500" },
    { icon: Clock, text: product.duration || "Permanent", color: "text-blue-500" },
    { icon: Award, text: "Premium Quality", color: "text-purple-500" }
  ];

  return (
    <Card 
      className="business-card group relative overflow-hidden h-full animate-slide-up"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Discount Badge */}
      {discountPercentage > 0 && (
        <div className="absolute top-4 right-4 z-10">
          <Badge className="bg-red-600 text-white font-bold animate-bounce-soft">
            {discountPercentage}% OFF
          </Badge>
        </div>
      )}

      {/* Trending/Popular Badge */}
      {(product.trending || product.popular) && (
        <div className="absolute top-4 left-4 z-10">
          <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold">
            {product.trending ? "🔥 TRENDING" : "⭐ POPULAR"}
          </Badge>
        </div>
      )}

      <CardHeader className="pb-4">
        {/* Product Icon */}
        <div className="w-16 h-16 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
          <ServiceIconComponent 
            serviceName={product.name} 
            className="w-full h-full object-contain rounded-lg shadow-lg"
          />
        </div>

        {/* Product Title */}
        <h3 className="text-lg font-bold text-center text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {product.name}
        </h3>

        {/* Subtitle */}
        {product.subcategory && (
          <p className="text-sm text-center text-gray-500 dark:text-gray-400 mt-1">
            {product.subcategory}
          </p>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Features Grid */}
        <div className="grid grid-cols-2 gap-2">
          {features.slice(0, 4).map((feature, index) => (
            <div key={index} className="flex items-center space-x-1">
              <feature.icon className={`w-3 h-3 ${feature.color}`} />
              <span className="text-xs text-gray-600 dark:text-gray-400 truncate">
                {feature.text}
              </span>
            </div>
          ))}
        </div>

        {/* Description */}
        {product.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {product.description}
          </p>
        )}

        {/* Features List */}
        {product.features && typeof product.features === 'object' && Array.isArray(product.features) && product.features.length > 0 && (
          <div className="space-y-1">
            {product.features.slice(0, 3).map((feature: string, index: number) => (
              <div key={index} className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  {feature}
                </span>
              </div>
            ))}
            {product.features.length > 3 && (
              <span className="text-xs text-blue-600 dark:text-blue-400">
                +{product.features.length - 3} more features
              </span>
            )}
          </div>
        )}

        {/* Pricing */}
        <div className="space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              ₹{product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                ₹{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
          
          {/* Savings */}
          {product.originalPrice && (
            <div className="text-center">
              <span className="text-sm font-medium text-green-600 dark:text-green-400">
                Save ₹{(product.originalPrice - product.price).toLocaleString()}
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <Button 
            onClick={() => isAuthenticated ? onCheckout(product) : window.location.href = "/api/login"}
            className="w-full btn-professional group-hover:scale-105 transition-transform"
            size="sm"
          >
            {isAuthenticated ? (
              <>
                <i className="fas fa-shopping-cart mr-2"></i>
                Buy Now
              </>
            ) : (
              <>
                <i className="fas fa-sign-in-alt mr-2"></i>
                Login to Buy
              </>
            )}
          </Button>
          
          <Link href={`/products/${product.id}`} className="block">
            <Button variant="outline" className="w-full" size="sm">
              <i className="fas fa-info-circle mr-2"></i>
              View Details
            </Button>
          </Link>
        </div>

        {/* Trust Indicators */}
        <div className="flex items-center justify-center space-x-4 pt-2 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-1">
            <Shield className="w-3 h-3 text-green-500" />
            <span className="text-xs text-gray-600 dark:text-gray-400">Secure</span>
          </div>
          <div className="flex items-center space-x-1">
            <Star className="w-3 h-3 text-yellow-500 fill-current" />
            <span className="text-xs text-gray-600 dark:text-gray-400">4.9/5</span>
          </div>
          <div className="flex items-center space-x-1">
            <Zap className="w-3 h-3 text-blue-500" />
            <span className="text-xs text-gray-600 dark:text-gray-400">Instant</span>
          </div>
        </div>
      </CardContent>

      {/* Hover Effect Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 transition-opacity duration-300 ${
        isHovered ? 'opacity-100' : 'opacity-0'
      }`} />
    </Card>
  );
}