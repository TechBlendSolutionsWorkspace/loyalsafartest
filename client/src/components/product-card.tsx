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
    <div className="product-card bg-card rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02] border border-border/50 flex flex-col h-full">
        <div className="relative flex-shrink-0 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-40 sm:h-48 object-cover mix-blend-multiply dark:mix-blend-screen opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          {product.popular && (
            <Badge className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-semibold px-3 py-1 shadow-lg">
              <i className="fas fa-fire mr-1"></i>
              Popular
            </Badge>
          )}
          {product.trending && (
            <Badge className="absolute top-3 left-3 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-semibold px-3 py-1 shadow-lg">
              <i className="fas fa-trending-up mr-1"></i>
              Trending
            </Badge>
          )}
          <div className="absolute top-3 right-3 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
            <i className={`${product.icon} text-primary text-lg`}></i>
          </div>
        </div>
        <div className="p-5 sm:p-6 flex flex-col flex-grow">
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg sm:text-xl font-bold text-card-foreground leading-tight">{product.name}</h3>
              <span className="text-xs sm:text-sm font-semibold text-primary bg-primary/10 px-2 py-1 rounded-full">{product.duration}</span>
            </div>
            <p className="text-sm text-muted-foreground font-medium">{product.subcategory}</p>
          </div>
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2 leading-relaxed">{product.description}</p>
          <div className="mb-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3">
            <p className="text-xs sm:text-sm text-blue-600 dark:text-blue-400 line-clamp-2 font-medium">
              <i className="fas fa-check-circle mr-2"></i>
              {product.features}
            </p>
          </div>
          
          {/* Review Stats */}
          {totalReviews > 0 && (
            <div className="flex items-center gap-2 mb-3">
              <StarRating rating={Math.round(averageRating)} size="sm" />
              <span className="text-sm text-muted-foreground">
                {averageRating.toFixed(1)} ({totalReviews} review{totalReviews !== 1 ? 's' : ''})
              </span>
            </div>
          )}
          
          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-bold text-primary">₹{product.price}</span>
                <span className="text-sm text-muted-foreground line-through">₹{product.originalPrice}</span>
              </div>
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 text-sm font-bold px-3 py-1 shadow-sm">
                {product.discount}% OFF
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
              <div className="flex items-center bg-slate-50 dark:bg-slate-800/50 p-2 rounded">
                <i className="fas fa-clock mr-2 text-blue-500"></i>
                <span>{product.activationTime}</span>
              </div>
              <div className="flex items-center bg-slate-50 dark:bg-slate-800/50 p-2 rounded">
                <i className="fas fa-shield-check mr-2 text-green-500"></i>
                <span>{product.warranty}</span>
              </div>
            </div>
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
