import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { ShoppingCart } from "lucide-react";
import EnhancedHeader from "@/components/enhanced-header";
import Footer from "@/components/footer";
import { Product, Category } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ServiceIconComponent } from "@/components/service-icons";
import CheckoutModal from "@/components/checkout-modal";
import { useAuth } from "@/hooks/useAuth";

export default function SubcategoryProductsPage() {
  const { categorySlug, subcategorySlug } = useParams<{ categorySlug: string; subcategorySlug: string }>();
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { isAuthenticated } = useAuth();
  
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const category = categories.find(cat => cat.slug === categorySlug);
  const subcategory = categories.find(cat => cat.slug === subcategorySlug && cat.parentCategoryId === category?.id);
  
  // Get products for this subcategory
  const subcategoryProducts = products.filter(product => 
    (product.category === category?.id || product.category === category?.slug) &&
    product.subcategory === subcategory?.name
  );

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
        <EnhancedHeader />
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

  if (!category || !subcategory) {
    return (
      <div className="min-h-screen bg-background">
        <EnhancedHeader />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold mb-4">Subcategory Not Found</h1>
          <Link href={`/category/${categorySlug}`}>
            <Button>Back to Category</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <EnhancedHeader />
      
      {/* Subcategory Header */}
      <section className="relative py-16 md:py-20 overflow-hidden">
        <div className="absolute inset-0 gradient-bg"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center text-white">
          <div className="mb-6">
            <i className={`${subcategory.icon} text-6xl mb-4 block drop-shadow-lg`}></i>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">{subcategory.name}</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto drop-shadow-md">
            {subcategory.description}
          </p>
          
          {/* Breadcrumb */}
          <div className="mt-6">
            <nav className="flex justify-center items-center space-x-2 text-blue-200">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <span>/</span>
              <Link href={`/category/${categorySlug}`} className="hover:text-white transition-colors">{category.name}</Link>
              <span>/</span>
              <span className="text-white">{subcategory.name}</span>
            </nav>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          {subcategoryProducts.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
                <ShoppingCart className="w-12 h-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No Products Found</h3>
              <p className="text-muted-foreground mb-4">
                This subcategory doesn't have any products yet.
              </p>
              <Link href={`/category/${categorySlug}`}>
                <Button variant="outline">Back to Category</Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">
                  {subcategory.name} Products
                </h2>
                <p className="text-sm text-muted-foreground">
                  Showing {subcategoryProducts.length} product{subcategoryProducts.length !== 1 ? 's' : ''}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subcategoryProducts.map((product) => (
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
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-primary">
                              ₹{product.price}
                            </span>
                            {product.originalPrice > product.price && (
                              <span className="text-sm text-muted-foreground line-through">
                                ₹{product.originalPrice}
                              </span>
                            )}
                          </div>
                          
                          <Button 
                            size="sm" 
                            onClick={() => handlePurchase(product)}
                            className="shrink-0"
                          >
                            Buy Now
                          </Button>
                        </div>
                        
                        {/* View Details Link */}
                        <Link href={`/product/${product.name.toLowerCase().replace(/\s+/g, '-')}`}>
                          <Button variant="outline" size="sm" className="w-full">
                            View Details
                          </Button>
                        </Link>
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
          open={checkoutOpen}
          onOpenChange={setCheckoutOpen}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}