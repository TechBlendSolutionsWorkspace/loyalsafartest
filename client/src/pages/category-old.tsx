import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { ChevronDown, ShoppingCart } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Product, Category } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ServiceIconComponent } from "@/components/service-icons";
import CheckoutModal from "@/components/checkout-modal";
import { useAuth } from "@/hooks/useAuth";

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("all");
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { isAuthenticated } = useAuth();
  
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const category = categories.find(cat => cat.slug === slug);
  
  // Get subcategories for this category (proper subcategory entities)
  const subcategories = categories.filter(cat => cat.isSubcategory && cat.parentCategoryId === category?.id);
  
  // Get products for counting purposes only
  const categoryProducts = products.filter(product => product.category === category?.id);
  
  // If no proper subcategories exist, create them from product subcategory strings
  const productSubcategories = Array.from(
    new Set(categoryProducts.map(p => p.subcategory).filter(Boolean))
  ).map(subcat => ({
    id: `temp-${subcat?.toLowerCase().replace(/\s+/g, '-')}`,
    name: subcat!,
    slug: subcat?.toLowerCase().replace(/\s+/g, '-')!,
    description: `${subcat} products and services`,
    icon: 'fas fa-layer-group',
    isSubcategory: true,
    parentCategoryId: category?.id,
    bannerImage: null,
    bannerTitle: null,
    bannerSubtitle: null,
  }));
  
  // Use proper subcategories if they exist, otherwise use product-based subcategories
  const displaySubcategories = subcategories.length > 0 ? subcategories : productSubcategories;
  
  // Filter products based on selected subcategory
  const filteredProducts = selectedSubcategory === "all" 
    ? categoryProducts
    : categoryProducts.filter(product => {
        const subcategory = displaySubcategories.find(sub => sub.id === selectedSubcategory || sub.name === selectedSubcategory);
        return product.subcategory === subcategory?.name;
      });

  const handlePurchase = (product: Product) => {
    if (!isAuthenticated) {
      window.location.href = "/api/login";
      return;
    }
    setSelectedProduct(product);
    setCheckoutOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 dark:bg-gray-700 h-48 rounded-lg mb-4"></div>
                <div className="bg-gray-200 dark:bg-gray-700 h-4 rounded mb-2"></div>
                <div className="bg-gray-200 dark:bg-gray-700 h-4 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold mb-4">Category Not Found</h1>
          <Link href="/">
            <Button>Return Home</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Category Hero */}
      <section className="relative py-16 md:py-20 overflow-hidden">
        {/* Background Video - Only for OTT category */}
        {category?.slug === 'ott' && (
          <div className="absolute inset-0 z-0">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
              style={{ 
                filter: 'brightness(0.3) blur(1px)',
                transform: 'scale(1.1)'
              }}
            >
              <source 
                src="@assets/Winter Theatre Performance Video Intro in Red Animated Style_1754152024546.mp4" 
                type="video/mp4" 
              />
            </video>
            {/* Video overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-purple-900/70 to-blue-900/80"></div>
          </div>
        )}
        
        {/* Fallback gradient for non-OTT categories */}
        {category?.slug !== 'ott' && (
          <div className="absolute inset-0 gradient-bg"></div>
        )}

        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center text-white">
          <div className="mb-6">
            <i className={`${category.icon} text-6xl mb-4 block drop-shadow-lg`}></i>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">{category.name}</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto drop-shadow-md">
            {category.description} - Authentic subscriptions at unbeatable prices
          </p>
        </div>
      </section>

      {/* Subcategory Selection and Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          {/* Subcategory Selector */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-3xl font-bold mb-2">Browse {category.name}</h2>
                <p className="text-muted-foreground">
                  Select a subcategory to view products, or see all available items
                </p>
              </div>
              
              <div className="w-full md:w-80">
                <Select value={selectedSubcategory} onValueChange={setSelectedSubcategory}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose subcategory..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All {category.name} Products ({categoryProducts.length})</SelectItem>
                    {displaySubcategories.map((subcategory) => {
                      const count = categoryProducts.filter(p => p.subcategory === subcategory.name).length;
                      return (
                        <SelectItem key={subcategory.id} value={subcategory.id}>
                          {subcategory.name} ({count})
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
                <ShoppingCart className="w-12 h-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No Products Found</h3>
              <p className="text-muted-foreground mb-4">
                {selectedSubcategory === "all" 
                  ? "This category doesn't have any products yet." 
                  : "No products available in the selected subcategory."}
              </p>
              <Button onClick={() => setSelectedSubcategory("all")} variant="outline">
                View All Products
              </Button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-muted-foreground">
                  Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} 
                  {selectedSubcategory !== "all" && (
                    <span> in {displaySubcategories.find(sub => sub.id === selectedSubcategory)?.name}</span>
                  )}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <Card key={product.id} className="hover:shadow-xl transition-shadow duration-300">
                    <div className="relative">
                      <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/5 rounded-t-lg flex items-center justify-center overflow-hidden">
                        {product.image ? (
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ServiceIconComponent serviceName={product.name} className="text-4xl text-primary" />
                        )}
                      </div>
                      
                      <div className="absolute top-4 left-4 flex gap-2">
                        {product.popular && <Badge className="bg-orange-500">Popular</Badge>}
                        {product.trending && <Badge className="bg-red-500">Trending</Badge>}
                      </div>
                      
                      {product.originalPrice > product.price && (
                        <div className="absolute top-4 right-4">
                          <Badge variant="destructive">
                            {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                          </Badge>
                        </div>
                      )}
                    </div>
                    
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg line-clamp-1">{product.name}</CardTitle>
                      <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <div className="space-y-4">
                        {/* Product Info */}
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Duration:</span>
                            <p className="text-muted-foreground">{product.duration}</p>
                          </div>
                          <div>
                            <span className="font-medium">Delivery:</span>
                            <p className="text-muted-foreground">{product.activationTime}</p>
                          </div>
                        </div>
                        
                        {/* Features */}
                        {product.features && (
                          <div className="text-sm">
                            <span className="font-medium">Features:</span>
                            <p className="text-muted-foreground line-clamp-1">
                              {product.features.split(',').slice(0, 2).join(', ')}
                              {product.features.split(',').length > 2 && '...'}
                            </p>
                          </div>
                        )}
                        
                        {/* Pricing */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-green-600">₹{product.price}</span>
                            {product.originalPrice > product.price && (
                              <span className="text-sm text-muted-foreground line-through">₹{product.originalPrice}</span>
                            )}
                          </div>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <Link href={`/product/${product.id}`} className="flex-1">
                            <Button variant="outline" className="w-full">
                              View Details
                            </Button>
                          </Link>
                          <Button 
                            onClick={() => handlePurchase(product)}
                            disabled={!product.available}
                            className="flex-1 bg-green-600 hover:bg-green-700"
                          >
                            {product.available ? "Buy Now" : "Unavailable"}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <Footer />
      
      {/* Checkout Modal */}
      {selectedProduct && (
        <CheckoutModal
          product={selectedProduct}
          isOpen={checkoutOpen}
          onClose={() => {
            setCheckoutOpen(false);
            setSelectedProduct(null);
          }}
        />
      )}
    </div>
  );
}
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          View Products →
                        </Button>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}