import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Product, Category } from "@shared/schema";
import Header from "@/components/header";
import Footer from "@/components/footer";
import ProductCard from "@/components/product-card";

export default function Products() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("popular");

  const { data: products = [], isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: categories = [], isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  // Filter products by category
  const filteredProducts = selectedCategory === "all" 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "discount":
        return b.discount - a.discount;
      case "popular":
        return b.popular ? 1 : -1;
      default:
        return 0;
    }
  });

  const categoryStats = categories.map(category => ({
    ...category,
    count: products.filter(p => p.category === category.slug).length
  }));

  if (productsLoading || categoriesLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
            <p>Loading products...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">Our Digital Services</h1>
          <p className="text-muted-foreground text-base sm:text-lg px-4">
            Premium digital subscriptions and tools at unbeatable prices
          </p>
        </div>

        {/* Category Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div 
            className={`p-3 sm:p-4 rounded-lg border cursor-pointer transition-colors ${
              selectedCategory === "all" ? "border-primary bg-primary/5" : "border-border hover:border-primary"
            }`}
            onClick={() => setSelectedCategory("all")}
          >
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-primary">{products.length}</div>
              <div className="text-xs sm:text-sm text-muted-foreground">All Products</div>
            </div>
          </div>
          {categoryStats.map((category) => (
            <div 
              key={category.slug}
              className={`p-3 sm:p-4 rounded-lg border cursor-pointer transition-colors ${
                selectedCategory === category.slug ? "border-primary bg-primary/5" : "border-border hover:border-primary"
              }`}
              onClick={() => setSelectedCategory(category.slug)}
            >
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-primary">{category.count}</div>
                <div className="text-xs sm:text-sm text-muted-foreground">{category.name}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.slug} value={category.slug}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="discount">Highest Discount</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2 sm:ml-auto">
            <Badge variant="outline" className="text-xs sm:text-sm">
              {sortedProducts.length} product{sortedProducts.length !== 1 ? 's' : ''} found
            </Badge>
          </div>
        </div>

        {/* Products Grid */}
        {sortedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-muted-foreground text-lg mb-4">
              No products found in this category
            </div>
            <Button onClick={() => setSelectedCategory("all")}>
              View All Products
            </Button>
          </div>
        )}

        {/* Categories Info */}
        <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div key={category.slug} className="text-center p-6 border rounded-lg bg-card">
              <i className={`${category.icon} text-primary text-3xl mb-4`}></i>
              <h3 className="font-semibold mb-2">{category.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">{category.description}</p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setSelectedCategory(category.slug)}
              >
                View Products
              </Button>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}