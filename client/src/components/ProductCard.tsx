import React from 'react';
import { Link } from 'wouter';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: string;
  compareAtPrice?: string;
  material: string;
  images: string[];
  isFeatured: boolean;
  isCustomizable: boolean;
  stock: number;
  categoryName: string;
}

interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'list';
}

export default function ProductCard({ product, viewMode = 'grid' }: ProductCardProps) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast({
        title: 'Please login',
        description: 'You need to login to add items to cart.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await addToCart(product.id, 1);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  const handleAddToWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast({
        title: 'Please login',
        description: 'You need to login to add items to wishlist.',
        variant: 'destructive',
      });
      return;
    }

    // Add wishlist functionality here
    toast({
      title: 'Added to wishlist',
      description: 'Item has been added to your wishlist.',
    });
  };

  const discountPercentage = product.compareAtPrice 
    ? Math.round(((parseFloat(product.compareAtPrice) - parseFloat(product.price)) / parseFloat(product.compareAtPrice)) * 100)
    : 0;

  if (viewMode === 'list') {
    return (
      <Link href={`/product/${product.slug}`}>
        <Card className="card-luxury hover:shadow-lg transition-all duration-300">
          <div className="flex">
            <div className="w-48 h-48 relative overflow-hidden rounded-l-lg">
              <img
                src={product.images[0] || 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop'}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {product.isFeatured && (
                <Badge className="absolute top-2 left-2 bg-yellow-500 text-black">
                  Featured
                </Badge>
              )}
              {discountPercentage > 0 && (
                <Badge className="absolute top-2 right-2 bg-red-500 text-white">
                  -{discountPercentage}%
                </Badge>
              )}
            </div>
            
            <CardContent className="flex-1 p-6">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-xl font-semibold mb-1">{product.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {product.categoryName} • {product.material}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleAddToWishlist}
                  className="text-gray-400 hover:text-red-500"
                >
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
              
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                {product.description}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-yellow-600">
                    ${parseFloat(product.price).toLocaleString()}
                  </span>
                  {product.compareAtPrice && (
                    <span className="text-sm text-gray-500 line-through">
                      ${parseFloat(product.compareAtPrice).toLocaleString()}
                    </span>
                  )}
                </div>
                
                <Button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="btn-luxury"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </Button>
              </div>
              
              {product.isCustomizable && (
                <p className="text-xs text-yellow-600 mt-2">
                  ✨ Customizable design available
                </p>
              )}
            </CardContent>
          </div>
        </Card>
      </Link>
    );
  }

  return (
    <Link href={`/product/${product.slug}`}>
      <Card className="card-luxury group cursor-pointer overflow-hidden">
        <div className="relative">
          <div className="aspect-square overflow-hidden">
            <img
              src={product.images[0] || 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop'}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.isFeatured && (
              <Badge className="bg-yellow-500 text-black">
                Featured
              </Badge>
            )}
            {discountPercentage > 0 && (
              <Badge className="bg-red-500 text-white">
                -{discountPercentage}%
              </Badge>
            )}
          </div>
          
          {/* Wishlist Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleAddToWishlist}
            className="absolute top-2 right-2 text-white bg-black/20 hover:bg-black/40 backdrop-blur-sm"
          >
            <Heart className="h-4 w-4" />
          </Button>
          
          {/* Quick Add to Cart */}
          <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="w-full btn-luxury"
              size="sm"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              {product.stock === 0 ? 'Out of Stock' : 'Quick Add'}
            </Button>
          </div>
        </div>
        
        <CardContent className="p-4">
          <div className="space-y-2">
            <h3 className="font-semibold truncate">{product.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {product.categoryName} • {product.material}
            </p>
            
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-yellow-600">
                ${parseFloat(product.price).toLocaleString()}
              </span>
              {product.compareAtPrice && (
                <span className="text-sm text-gray-500 line-through">
                  ${parseFloat(product.compareAtPrice).toLocaleString()}
                </span>
              )}
            </div>
            
            {product.isCustomizable && (
              <p className="text-xs text-yellow-600">
                ✨ Customizable
              </p>
            )}
            
            {/* Rating placeholder */}
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="text-xs text-gray-500 ml-1">(24)</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}