import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Product, Category } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ServiceIconComponent } from "@/components/service-icons";

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  
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

      {/* Subcategories Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Available Subcategories</h2>
            <p className="text-muted-foreground text-lg">
              Browse our {category.name.toLowerCase()} subcategories
            </p>
          </div>

          {displaySubcategories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No subcategories available in this category yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
              {displaySubcategories.map((subcategory) => {
                const subcategoryProducts = categoryProducts.filter(p => p.subcategory === subcategory.name);
                const subcategorySlug = subcategory.slug || subcategory.name.toLowerCase().replace(/\s+/g, '-');
                
                return (
                  <Link key={subcategory.id} href={`/category/${category.slug}/subcategory/${subcategorySlug}/products`}>
                    <div className="business-card rounded-xl p-4 sm:p-6 hover:shadow-xl transition-all duration-300 cursor-pointer">
                      <div className="relative mb-4">
                        <div className="w-full h-36 sm:h-48 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-lg flex items-center justify-center">
                          <i className={`${subcategory.icon || 'fas fa-layer-group'} text-4xl text-blue-600 dark:text-blue-400`}></i>
                        </div>
                        {subcategoryProducts.length > 0 && (
                          <div className="absolute top-3 right-3">
                            <Badge className="bg-green-500">
                              {subcategoryProducts.length} Products
                            </Badge>
                          </div>
                        )}
                      </div>

                      <div className="mb-4">
                        <h3 className="font-semibold text-lg mb-2">{subcategory.name}</h3>
                        <p className="text-muted-foreground text-sm line-clamp-2">
                          {subcategory.description || `Browse all ${subcategory.name.toLowerCase()} products and services`}
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          {subcategoryProducts.length} Product{subcategoryProducts.length !== 1 ? 's' : ''}
                        </span>
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