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
  const categoryProducts = products.filter(product => product.category === category?.id);
  
  // Group products by their base name to show only unique products
  const uniqueProducts = categoryProducts.reduce((acc, product) => {
    const baseName = product.name.split(' - ')[0] || product.name;
    if (!acc[baseName] || product.popular || product.trending) {
      acc[baseName] = product;
    }
    return acc;
  }, {} as Record<string, Product>);

  const mainProducts = Object.values(uniqueProducts);

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

      {/* Products Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Available Services</h2>
            <p className="text-muted-foreground text-lg">
              Choose from our premium {category.name.toLowerCase()} collection
            </p>
          </div>

          {mainProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No products available in this category yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
              {mainProducts.map((product) => (
                <div key={product.id} className="business-card rounded-xl p-4 sm:p-6 hover:shadow-xl transition-all duration-300">
                  <div className="relative mb-4">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-36 sm:h-48 object-cover rounded-lg"
                    />
                    {(product.popular || product.trending) && (
                      <div className="absolute top-3 left-3">
                        <Badge className={product.popular ? "bg-orange-500" : "bg-blue-500"}>
                          {product.popular ? "Popular" : "Trending"}
                        </Badge>
                      </div>
                    )}
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <ServiceIconComponent serviceName={product.name} className="flex-shrink-0" />
                      <h3 className="text-lg sm:text-xl font-bold line-clamp-1">{product.name}</h3>
                    </div>
                    <p className="text-muted-foreground text-xs sm:text-sm mb-3 line-clamp-2">{product.description}</p>
                    
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-baseline gap-1 sm:gap-2">
                        <span className="text-xl sm:text-2xl font-bold text-primary">₹{product.price}</span>
                        <span className="text-xs sm:text-sm text-muted-foreground line-through">₹{product.originalPrice}</span>
                      </div>
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 text-xs">
                        {product.discount}% OFF
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground mb-4">
                      <div className="flex items-center bg-slate-50 dark:bg-slate-800/50 p-2 rounded">
                        <i className="fas fa-clock mr-2 text-blue-500 text-xs"></i>
                        <span className="truncate">{product.activationTime}</span>
                      </div>
                      <div className="flex items-center bg-slate-50 dark:bg-slate-800/50 p-2 rounded">
                        <i className="fas fa-shield-check mr-2 text-green-500 text-xs"></i>
                        <span className="truncate">{product.warranty}</span>
                      </div>
                    </div>
                  </div>

                  <Link to={`/category/${category.slug}/subcategories`}>
                    <Button className="w-full font-semibold text-sm sm:text-base">
                      View Subcategories
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}