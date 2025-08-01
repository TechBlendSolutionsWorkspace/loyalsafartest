import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import CheckoutModal from "@/components/checkout-modal";
import { Product } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";

export default function ProductVariantsPage() {
  const { productName } = useParams<{ productName: string }>();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  
  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  // Find all variants of the product
  const productNameFormatted = productName?.replace(/-/g, ' ');
  const productVariants = products.filter(product => 
    product.name.toLowerCase().includes(productNameFormatted?.toLowerCase() || '')
  );

  const mainProduct = productVariants[0];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="animate-pulse">
            <div className="bg-gray-200 dark:bg-gray-700 h-64 rounded-lg mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-gray-200 dark:bg-gray-700 h-48 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!mainProduct) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
          <Link href="/">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Return Home
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const handleBuyNow = (product: Product) => {
    setSelectedProduct(product);
    setShowCheckout(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Product Hero */}
      <section className="gradient-bg py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-6">
            <Link href={`/category/${mainProduct.category}`}>
              <Button variant="outline" className="text-white border-white hover:bg-white hover:text-gray-900 mb-6">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Category
              </Button>
            </Link>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center text-white">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">{mainProduct.name}</h1>
              <p className="text-xl text-blue-100 mb-6 leading-relaxed">
                {mainProduct.description}
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                  <i className="fas fa-shield-check text-green-400 mr-2"></i>
                  <span className="text-sm font-semibold">100% Authentic</span>
                </div>
                <div className="flex items-center bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                  <i className="fas fa-clock text-blue-400 mr-2"></i>
                  <span className="text-sm font-semibold">Instant Delivery</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <img 
                src={mainProduct.image} 
                alt={mainProduct.name}
                className="rounded-xl shadow-2xl w-full h-auto max-w-md mx-auto"
              />
              <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                <i className="fas fa-shield-check mr-1"></i>
                Verified
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Variants */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Choose Your Plan</h2>
            <p className="text-muted-foreground text-lg">
              Select the perfect subscription duration for your needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {productVariants.map((product) => (
              <div 
                key={product.id} 
                className={`business-card rounded-xl p-6 relative transition-all duration-300 hover:shadow-xl ${
                  product.popular ? 'ring-2 ring-blue-500 scale-105' : ''
                }`}
              >
                {product.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-500 text-white px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                {product.trending && (
                  <div className="absolute -top-3 right-4">
                    <Badge className="bg-orange-500 text-white px-3 py-1">
                      Trending
                    </Badge>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">{product.duration}</h3>
                  <p className="text-muted-foreground">{product.subcategory}</p>
                </div>

                <div className="text-center mb-6">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-4xl font-bold text-primary">₹{product.price}</span>
                    <span className="text-lg text-muted-foreground line-through">₹{product.originalPrice}</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 text-lg px-3 py-1">
                    {product.discount}% OFF
                  </Badge>
                </div>

                <div className="space-y-3 mb-6">
                  {product.features.split(', ').map((feature, index) => (
                    <div key={index} className="flex items-center text-sm">
                      <i className="fas fa-check text-green-500 mr-2"></i>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mb-6">
                  <div className="flex items-center bg-slate-50 dark:bg-slate-800/50 p-2 rounded">
                    <i className="fas fa-clock mr-2 text-blue-500"></i>
                    <span>{product.activationTime}</span>
                  </div>
                  <div className="flex items-center bg-slate-50 dark:bg-slate-800/50 p-2 rounded">
                    <i className="fas fa-shield-check mr-2 text-green-500"></i>
                    <span>{product.warranty} warranty</span>
                  </div>
                </div>

                <Button 
                  className={`w-full font-semibold ${
                    product.popular ? 'bg-blue-600 hover:bg-blue-700' : ''
                  }`}
                  onClick={() => handleBuyNow(product)}
                >
                  Buy Now
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      
      {showCheckout && selectedProduct && (
        <CheckoutModal
          product={selectedProduct}
          isOpen={showCheckout}
          onClose={() => setShowCheckout(false)}
        />
      )}
    </div>
  );
}