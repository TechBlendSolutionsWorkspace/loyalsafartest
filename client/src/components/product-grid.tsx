import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ProductCard from "@/components/product-card";
import { Product, Category } from "@shared/schema";

interface ProductGridProps {
  products: Product[];
  categories: Category[];
  isLoading: boolean;
}

export default function ProductGrid({ products, categories, isLoading }: ProductGridProps) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    if (filter === "all") {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(product => product.category === filter));
    }
  };

  // Update filtered products when products change
  useState(() => {
    if (activeFilter === "all") {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(product => product.category === activeFilter));
    }
  });

  if (isLoading) {
    return (
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Skeleton className="h-10 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-card rounded-xl shadow-lg overflow-hidden">
                <Skeleton className="w-full h-48" />
                <div className="p-6">
                  <Skeleton className="h-6 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <Skeleton className="h-8 w-24 mb-4" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const displayProducts = activeFilter === "all" ? products : filteredProducts;

  return (
    <section id="products" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">Our Digital Services</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Choose from our wide range of premium digital services, all available at fraction of original prices
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <Button
            onClick={() => handleFilterChange("all")}
            variant={activeFilter === "all" ? "default" : "outline"}
            className="rounded-full font-medium"
          >
            All Categories
          </Button>
          {categories.slice(0, 6).map((category) => (
            <Button
              key={category.id}
              onClick={() => handleFilterChange(category.slug)}
              variant={activeFilter === category.slug ? "default" : "outline"}
              className="rounded-full font-medium"
            >
              {category.name}
            </Button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {displayProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {displayProducts.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No products found in this category.</p>
          </div>
        )}

        <div className="text-center mt-12">
          <Button variant="outline" className="px-8 py-4 font-semibold">
            View All Products
          </Button>
        </div>
      </div>
    </section>
  );
}
