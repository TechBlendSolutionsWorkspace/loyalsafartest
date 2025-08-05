import { useState } from "react";
import { useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ShoppingCart, Check, Clock, Shield, Star, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/header";
import Footer from "@/components/footer";
import CheckoutModal from "@/components/checkout-modal";
import type { Product, Category } from "@shared/schema";

export default function ProductDetail() {
  const [, params] = useRoute("/product/:productId");
  const productId = params?.productId || "";
  
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  // Fetch data
  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const product = products.find((p) => p.id === productId);
  const category = categories.find((c) => c.id === product?.category);

  const handlePurchase = () => {
    if (!isAuthenticated) {
      window.location.href = "/api/login";
      return;
    }
    setCheckoutOpen(true);
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
          <Link href="/">
            <Button>Return Home</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const features = product.features?.split(',').map((f: string) => f.trim()).filter(Boolean) || [];
  const discountPercentage = product.originalPrice > 0 
    ? Math.round((1 - product.price / product.originalPrice) * 100) 
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Breadcrumb */}
      <div className="border-b bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">Home</Link>
            <span>/</span>
            <Link href={`/category/${category?.slug}`} className="hover:text-foreground">
              {category?.name}
            </Link>
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-square bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-2xl flex items-center justify-center">
              {product.image ? (
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover rounded-2xl"
                />
              ) : (
                <i className={`${product.icon || 'fas fa-box'} text-6xl text-blue-600 dark:text-blue-400`}></i>
              )}
            </div>
            
            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <Shield className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <p className="text-sm font-medium">Secure Payment</p>
              </div>
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Clock className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <p className="text-sm font-medium">Fast Delivery</p>
              </div>
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <Check className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                <p className="text-sm font-medium">Authentic</p>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{product.name}</h1>
                {product.popular && <Badge className="bg-orange-500">Popular</Badge>}
                {product.trending && <Badge className="bg-red-500">Trending</Badge>}
              </div>
              <p className="text-lg text-muted-foreground">{product.fullProductName}</p>
            </div>

            {/* Pricing */}
            <div className="flex items-center gap-4">
              <span className="text-4xl font-bold text-green-600">₹{product.price}</span>
              {product.originalPrice > product.price && (
                <>
                  <span className="text-xl text-muted-foreground line-through">₹{product.originalPrice}</span>
                  <Badge variant="destructive" className="text-lg px-3 py-1">
                    {discountPercentage}% OFF
                  </Badge>
                </>
              )}
            </div>

            {/* Key Details */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Duration</p>
                      <p className="text-sm text-muted-foreground">{product.duration}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium">Warranty</p>
                      <p className="text-sm text-muted-foreground">{product.warranty}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Features */}
            {features.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Features Included</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-2">
                    {features.map((feature: string, index: number) => (
                      <div key={index} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Product Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </CardContent>
            </Card>

            {/* Additional Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Activation Time:</span>
                <span className="text-muted-foreground ml-2">{product.activationTime}</span>
              </div>
              <div>
                <span className="font-medium">Category:</span>
                <span className="text-muted-foreground ml-2">{category?.name}</span>
              </div>
              {product.subcategory && (
                <div className="sm:col-span-2">
                  <span className="font-medium">Subcategory:</span>
                  <span className="text-muted-foreground ml-2">{product.subcategory}</span>
                </div>
              )}
            </div>

            {product.notes && (
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  <strong>Important Note:</strong> {product.notes}
                </p>
              </div>
            )}

            {/* Purchase Button */}
            <div className="flex gap-4">
              <Button 
                onClick={handlePurchase}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 text-lg"
                disabled={!product.available}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {product.available ? 'Buy Now' : 'Out of Stock'}
              </Button>
              <Button variant="outline" size="lg">
                <Heart className="w-5 h-5" />
              </Button>
            </div>

            {/* Delivery Info */}
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-muted-foreground">
                🚀 <strong>Instant Delivery:</strong> Get your account details via WhatsApp within {product.activationTime}
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      
      {/* Checkout Modal */}
      {checkoutOpen && product && (
        <CheckoutModal
          isOpen={checkoutOpen}
          onClose={() => setCheckoutOpen(false)}
          product={product}
        />
      )}
    </div>
  );
}