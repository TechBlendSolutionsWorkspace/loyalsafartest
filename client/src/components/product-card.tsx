import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import CheckoutModal from "@/components/checkout-modal";
import { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [showCheckout, setShowCheckout] = useState(false);

  return (
    <>
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
            <h3 className="text-lg font-semibold text-card-foreground">{product.name}</h3>
          </div>
          <p className="text-muted-foreground mb-4">{product.description}</p>
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-2xl font-bold text-primary">₹{product.price}</span>
              <span className="text-muted-foreground line-through ml-2">₹{product.originalPrice}</span>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
              {product.discount}% OFF
            </Badge>
          </div>
          <Button 
            className="w-full font-semibold"
            onClick={() => setShowCheckout(true)}
            disabled={!product.available}
          >
            {product.available ? "Buy Now" : "Out of Stock"}
          </Button>
        </div>
      </div>

      <CheckoutModal 
        product={product}
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
      />
    </>
  );
}
