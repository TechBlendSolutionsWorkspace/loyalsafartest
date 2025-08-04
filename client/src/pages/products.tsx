import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useRoute, useLocation } from "wouter";
import Header from "@/components/header";
import Footer from "@/components/footer";
import ProductGrid from "@/components/product-grid";
import { Product, Category } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Grid, List } from "lucide-react";

export default function Products() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const { data: products = [], isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: categories = [], isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get category count
  const getCategoryCount = (categoryId: string) => {
    return products.filter(p => p.category === categoryId).length;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Our Products</h1>
          <p className="text-lg text-muted-foreground">Discover our complete range of digital services and subscriptions</p>
        </div>

        {/* Search and Filter Controls */}
        <div className="mb-8 bg-card rounded-lg p-6 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* View Mode Toggle */}
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Category Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Categories
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant={selectedCategory === '' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setSelectedCategory('')}
                >
                  All Products
                  <Badge variant="secondary" className="ml-auto">
                    {products.length}
                  </Badge>
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    {category.name}
                    <Badge variant="secondary" className="ml-auto">
                      {getCategoryCount(category.id)}
                    </Badge>
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Products Display */}
          <div className="lg:col-span-3">
            {/* Results Count */}
            <div className="mb-6">
              <p className="text-muted-foreground">
                Showing {filteredProducts.length} of {products.length} products
                {selectedCategory && (
                  <span className="ml-2">
                    in <strong>{categories.find(c => c.id === selectedCategory)?.name}</strong>
                  </span>
                )}
              </p>
            </div>

            {/* Products Grid/List */}
            {productsLoading || categoriesLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No products found matching your criteria.</p>
                <Button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('');
                  }}
                  className="mt-4"
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <ProductGrid 
                products={filteredProducts} 
                categories={categories}
                isLoading={false}
                viewMode={viewMode}
              />
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}