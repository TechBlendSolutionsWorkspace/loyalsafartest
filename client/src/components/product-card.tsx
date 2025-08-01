import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Product, Review } from "@shared/schema";
import StarRating from "./star-rating";
import { MessageCircle } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [, setLocation] = useLocation();
  
  // Fetch reviews for this product
  const { data: reviews = [] } = useQuery<Review[]>({
    queryKey: ["/api/products", product.id, "reviews"],
  });
  
  // Calculate review stats
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
    : 0;

  return (
    <div className="product-card bg-card rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 border flex flex-col h-full">
        <div className="relative flex-shrink-0">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-40 sm:h-48 object-cover"
          />
          {product.popular && (
            <Badge className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-red-600 text-white text-xs">
              Popular
            </Badge>
          )}
          {product.trending && (
            <Badge className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-green-600 text-white text-xs">
              Trending
            </Badge>
          )}
        </div>
        <div className="p-4 sm:p-6 flex flex-col flex-grow">
          <div className="flex items-start mb-3">
            <i className={`${product.icon} text-primary text-xl sm:text-2xl mr-2 sm:mr-3 flex-shrink-0 mt-1`}></i>
            <div className="min-w-0 flex-1">
              <h3 className="text-base sm:text-lg font-semibold text-card-foreground leading-tight">{product.name}</h3>
              <span className="text-xs sm:text-sm text-muted-foreground">{product.duration}</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{product.description}</p>
          <p className="text-xs sm:text-sm text-blue-600 dark:text-blue-400 mb-3 line-clamp-2">{product.features}</p>
          
          {/* Review Stats */}
          {totalReviews > 0 && (
            <div className="flex items-center gap-2 mb-3">
              <StarRating rating={Math.round(averageRating)} size="sm" />
              <span className="text-sm text-muted-foreground">
                {averageRating.toFixed(1)} ({totalReviews} review{totalReviews !== 1 ? 's' : ''})
              </span>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
            <div className="flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-bold text-primary">₹{product.price}</span>
              <span className="text-sm text-muted-foreground line-through">₹{product.originalPrice}</span>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 text-xs sm:text-sm w-fit">
              {product.discount}% OFF
            </Badge>
          </div>
          <div className="text-xs text-muted-foreground mb-4 space-y-1 flex-grow">
            <div className="flex items-center">⚡ {product.activationTime}</div>
            <div className="flex items-center">🛡️ {product.warranty} warranty</div>
            {product.notes && <div className="flex items-start">📝 {product.notes}</div>}
          </div>
          <Button 
            className="w-full font-semibold text-sm sm:text-base mt-auto"
            onClick={() => setLocation(`/checkout?product=${product.id}`)}
            disabled={!product.available}
          >
            {product.available ? "Buy Now" : "Out of Stock"}
          </Button>
        </div>
      </div>
  );
}
