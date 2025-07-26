import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [, setLocation] = useLocation();

  return (
    <div className="product-card bg-card rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl border">
        <div className="relative">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-48 object-cover"
          />
          {product.popular && (
            <Badge className="absolute top-4 left-4 bg-red-600 text-white">
              Popular
            </Badge>
          )}
          {product.trending && (
            <Badge className="absolute top-4 left-4 bg-green-600 text-white">
              Trending
            </Badge>
          )}
        </div>
        <div className="p-6">
          <div className="flex items-center mb-3">
            <i className={`${product.icon} text-primary text-2xl mr-3`}></i>
            <div>
              <h3 className="text-lg font-semibold text-card-foreground">{product.name}</h3>
              <span className="text-sm text-muted-foreground">{product.duration}</span>
            </div>
          </div>
          <p className="text-muted-foreground mb-2">{product.description}</p>
          <p className="text-sm text-blue-600 dark:text-blue-400 mb-4">{product.features}</p>
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-2xl font-bold text-primary">₹{product.price}</span>
              <span className="text-muted-foreground line-through ml-2">₹{product.originalPrice}</span>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
              {product.discount}% OFF
            </Badge>
          </div>
          <div className="text-xs text-muted-foreground mb-3 space-y-1">
            <div>⚡ {product.activationTime}</div>
            <div>🛡️ {product.warranty} warranty</div>
            {product.notes && <div>📝 {product.notes}</div>}
          </div>
          <Button 
            className="w-full font-semibold"
            onClick={() => setLocation(`/checkout?product=${product.id}`)}
            disabled={!product.available}
          >
            {product.available ? "Buy Now" : "Out of Stock"}
          </Button>
        </div>
      </div>
  );
}
