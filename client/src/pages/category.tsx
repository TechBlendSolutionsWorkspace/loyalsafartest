import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import EnhancedHeader from "@/components/enhanced-header";
import Footer from "@/components/footer";
import { Product, Category } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const category = categories.find(cat => cat.slug === slug);
  
  // Get subcategories for this category (proper subcategory entities)
  const subcategories = categories.filter(cat => cat.isSubcategory && cat.parentCategoryId === category?.id);
  
  // Get products for this category - handle both ID and slug references
  const categoryProducts = products.filter(product => 
    product.category === category?.id || product.category === category?.slug
  );
  
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

  if (!category) {
    return (
      <div className="min-h-screen bg-background">
        <EnhancedHeader />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold mb-4">Category Not Found</h1>
          <Link href="/">
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Return Home</button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <EnhancedHeader />
      
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

      {/* Subcategory Selection */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          {/* Subcategories as Cards */}
          {displaySubcategories.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
                Choose a Subcategory
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Individual Subcategory Cards */}
                {displaySubcategories.map((subcat) => {
                  const subcategoryProducts = categoryProducts.filter(p => p.subcategory === subcat.name);
                  return (
                    <Link 
                      key={subcat.id}
                      href={`/category/${category?.slug}/subcategory/${subcat.slug}`}
                    >
                      <Card className="cursor-pointer transition-all duration-300 hover:shadow-xl business-card hover:scale-105">
                        <CardContent className="p-6 text-center">
                          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-green-500 to-teal-600 flex items-center justify-center">
                            <i className={`${subcat.icon} text-2xl text-white`}></i>
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            {subcat.name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                            {subcat.description}
                          </p>
                          <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                            {subcategoryProducts.length} Products
                          </Badge>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}