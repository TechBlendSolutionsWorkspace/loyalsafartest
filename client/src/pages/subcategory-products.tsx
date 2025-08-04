import { useState } from "react";
import { useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Filter, Grid, List, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/header";
import Footer from "@/components/footer";
import CheckoutModal from "@/components/checkout-modal";
import type { Product, Category } from "@shared/schema";

export default function SubcategoryProducts() {
  const [, params] = useRoute("/category/:categorySlug/subcategory/:subcategoryId/products");
  const categorySlug = params?.categorySlug || "";
  const subcategoryId = params?.subcategoryId || "";
  
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const { isAuthenticated } = useAuth();

  // Fetch data
  const { data: categories } = useQuery({
    queryKey: ["/api/categories"],
  });

  const { data: products = [] } = useQuery({
    queryKey: ["/api/products"],
  });

  const currentCategory = categories?.find((cat: Category) => cat.slug === categorySlug);
  const subcategoryName = subcategoryId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  
  // Filter products for this subcategory
  const subcategoryProducts = products.filter((product: Product) => {
    const matchesCategory = product.category === currentCategory?.id;
    const matchesSubcategory = product.subcategory?.toLowerCase().replace(/\s+/g, '-') === subcategoryId;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesSubcategory && matchesSearch;
  });

  // Sort products
  const sortedProducts = [...subcategoryProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "rating":
        return (b.rating || 0) - (a.rating || 0);
      case "popular":
        return Number(b.popular) - Number(a.popular);
      default:
        return a.name.localeCompare(b.name);
    }
  });

  const handlePurchase = (product: Product) => {
    if (!isAuthenticated) {
      window.location.href = "/api/login";
      return;
    }
    setSelectedProduct(product);
    setCheckoutOpen(true);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (!currentCategory) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Category Not Found</h1>
            <Link to="/">
              <Button>Return Home</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to={`/category/${categorySlug}/subcategories`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Subcategories
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{subcategoryName}</h1>
            <p className="text-muted-foreground">
              {currentCategory.name} • {sortedProducts.length} Products
            </p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name A-Z</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="flex gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Products */}
        {sortedProducts.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-2">No Products Found</h2>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? "Try adjusting your search terms." : "This subcategory doesn't have any products yet."}
            </p>
            {isAuthenticated && !searchTerm && (
              <Link to="/admin">
                <Button>Add Products</Button>
              </Link>
            )}
          </div>
        ) : (
          <div className={viewMode === "grid" 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
            : "space-y-4"
          }>
            {sortedProducts.map((product) => (
              <Card key={product.id} className={`hover:shadow-lg transition-shadow ${
                viewMode === "list" ? "flex flex-row" : ""
              }`}>
                <div className={viewMode === "list" ? "w-48 flex-shrink-0" : ""}>
                  <div className={`aspect-video bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg ${
                    viewMode === "list" ? "m-4 h-32" : "m-4"
                  } flex items-center justify-center overflow-hidden`}>
                    {product.image ? (
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <i className={`${currentCategory.icon} text-3xl text-primary`}></i>
                    )}
                  </div>
                </div>
                
                <div className="flex-1">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{product.name}</CardTitle>
                        <p className="text-sm text-muted-foreground mb-2">
                          {product.duration} • {product.activationTime}
                        </p>
                        {product.popular && (
                          <Badge variant="secondary" className="mr-2">Popular</Badge>
                        )}
                        {product.trending && (
                          <Badge variant="outline">Trending</Badge>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">
                          {formatPrice(product.price)}
                        </div>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <div className="text-sm text-muted-foreground line-through">
                            {formatPrice(product.originalPrice)}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {product.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-sm">
                        <div className="font-medium">Features:</div>
                        <div className="text-muted-foreground">{product.features}</div>
                      </div>
                      
                      <Button 
                        onClick={() => handlePurchase(product)}
                        disabled={!product.available}
                      >
                        {product.available ? "Purchase" : "Unavailable"}
                      </Button>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

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
      
      <Footer />
    </div>
  );
}