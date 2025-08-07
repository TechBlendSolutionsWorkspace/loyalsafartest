import { Link } from "wouter";
import { Product, Category } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { ServiceIconComponent } from "@/components/service-icons";
import EnhancedProductCard from "@/components/enhanced-product-card";
import { useState, useEffect, useRef } from "react";
import CheckoutModal from "@/components/checkout-modal";
import { useAuth } from "@/hooks/useAuth";
import { ChevronLeft, ChevronRight } from "lucide-react";


interface ProductGridProps {
  products: Product[];
  categories: Category[];
  isLoading: boolean;
  viewMode?: 'grid' | 'list';
}

export default function ProductGrid({ products, categories, isLoading, viewMode = 'grid' }: ProductGridProps) {
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { isAuthenticated } = useAuth();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const autoScrollRef = useRef<NodeJS.Timeout | null>(null);

  // Show all products if no featured products, or limit to 12 featured products
  const featuredProducts = products.filter(product => product.popular || product.trending).slice(0, 12);
  const displayProducts = featuredProducts.length > 0 ? featuredProducts : products.slice(0, 12);
  // Filter to show only main categories (not subcategories) on homepage
  const mainCategories = categories.filter(category => !category.isSubcategory);
  
  // Debug logging for production
  console.log("🔍 ProductGrid Debug:", {
    totalProducts: products.length,
    featuredProducts: featuredProducts.length,
    displayProducts: displayProducts.length,
    totalCategories: categories.length,
    mainCategories: mainCategories.length,
    firstMainCategory: mainCategories[0]?.name || "None",
    firstProduct: products[0]?.name || "None",
    isLoading,
    hasData: categories.length > 0 && products.length > 0
  });

  const handleCheckout = (product: Product) => {
    setSelectedProduct(product);
    setCheckoutOpen(true);
  };

  // Auto-scroll functionality
  useEffect(() => {
    if (featuredProducts.length <= 3) return; // Don't auto-scroll if 3 or fewer items

    const startAutoScroll = () => {
      autoScrollRef.current = setInterval(() => {
        setCurrentIndex(prev => {
          const nextIndex = prev + 1;
          return nextIndex >= featuredProducts.length - 2 ? 0 : nextIndex;
        });
      }, 4000); // Auto-scroll every 4 seconds
    };

    const stopAutoScroll = () => {
      if (autoScrollRef.current) {
        clearInterval(autoScrollRef.current);
        autoScrollRef.current = null;
      }
    };

    startAutoScroll();

    // Pause auto-scroll on hover
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('mouseenter', stopAutoScroll);
      container.addEventListener('mouseleave', startAutoScroll);
    }

    return () => {
      stopAutoScroll();
      if (container) {
        container.removeEventListener('mouseenter', stopAutoScroll);
        container.removeEventListener('mouseleave', startAutoScroll);
      }
    };
  }, [displayProducts.length]);

  // Smooth scroll to current index
  useEffect(() => {
    if (scrollContainerRef.current) {
      const cardWidth = 320; // Approximate card width + gap
      const scrollPosition = currentIndex * cardWidth;
      scrollContainerRef.current.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
    }
  }, [currentIndex]);

  const scrollTo = (direction: 'left' | 'right') => {
    if (direction === 'left') {
      setCurrentIndex(prev => Math.max(0, prev - 1));
    } else {
      setCurrentIndex(prev => Math.min(displayProducts.length - 3, prev + 1));
    }
  };

  if (isLoading) {
    return (
      <>
        {/* Featured Products Loading */}
        <section className="py-16 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="bg-gray-200 dark:bg-gray-700 h-8 w-64 mx-auto rounded mb-4"></div>
              <div className="bg-gray-200 dark:bg-gray-700 h-4 w-96 mx-auto rounded"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={`featured-${i}`} className="animate-pulse business-card p-6">
                  <div className="bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 h-48 rounded-xl mb-4 animate-glow"></div>
                  <div className="bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 h-6 rounded mb-2"></div>
                  <div className="bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 h-4 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Categories Loading */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="bg-gray-200 dark:bg-gray-700 h-8 w-48 mx-auto rounded mb-4"></div>
              <div className="bg-gray-200 dark:bg-gray-700 h-4 w-80 mx-auto rounded"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={`categories-${i}`} className="animate-pulse business-card p-6">
                  <div className="bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 h-48 rounded-xl mb-4 animate-glow"></div>
                  <div className="bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 h-6 rounded mb-2"></div>
                  <div className="bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 h-4 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      {/* Featured Products - Always show products */}
      {displayProducts.length > 0 && (
        <section className="py-8 md:py-16 section-gradient">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 md:mb-4">
                {featuredProducts.length > 0 ? 'Popular & Trending Services' : 'Featured Digital Services'}
              </h2>
              <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto px-4">
                India's premium digital services at affordable prices - {displayProducts.length} products available
              </p>
            </div>
            <div className="relative">
              {/* Navigation Arrows */}
              {displayProducts.length > 3 && (
                <>
                  <button
                    onClick={() => scrollTo('left')}
                    disabled={currentIndex === 0}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                  </button>
                  <button
                    onClick={() => scrollTo('right')}
                    disabled={currentIndex >= displayProducts.length - 3}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                  </button>
                </>
              )}

              {/* Scrollable Container */}
              <div 
                ref={scrollContainerRef}
                className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
                style={{ scrollSnapType: 'x mandatory' }}
              >
                {displayProducts.map((product) => (
                  <div 
                    key={product.id} 
                    className="flex-shrink-0 w-80"
                    style={{ scrollSnapAlign: 'start' }}
                  >
                    <EnhancedProductCard
                      product={product}
                      onCheckout={handleCheckout}
                      isAuthenticated={isAuthenticated}
                    />
                  </div>
                ))}
              </div>

              {/* Dots Indicator */}
              {displayProducts.length > 3 && (
                <div className="flex justify-center mt-6 space-x-2">
                  {Array.from({ length: Math.max(0, displayProducts.length - 2) }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentIndex
                          ? 'bg-blue-600 w-6'
                          : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Checkout Modal */}
      {selectedProduct && (
        <CheckoutModal 
          isOpen={checkoutOpen}
          onClose={() => setCheckoutOpen(false)}
          product={selectedProduct}
        />
      )}

      {/* Service Categories */}
      <section id="categories" className="py-8 md:py-16 section-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 md:mb-4">
              Digital Service Categories
            </h2>
            <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto px-4">
              Choose from India's finest digital service categories
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
            {mainCategories.length > 0 ? (
              mainCategories.map((category) => (
              <div 
                key={category.id} 
                className="business-card rounded-xl p-6 md:p-8 text-center hover:shadow-xl transition-all duration-300 group"
              >
                <div className="mb-4 md:mb-6">
                  <div className="w-16 h-16 md:w-20 md:h-20 mx-auto bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl md:rounded-2xl flex items-center justify-center mb-3 md:mb-4 group-hover:scale-110 transition-transform duration-300">
                    <i className={`${category.icon} text-white text-2xl md:text-3xl`}></i>
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm line-clamp-2">
                    {category.description}
                  </p>
                </div>
                
                <Link href={`/category/${category.slug}`}>
                  <Button className="w-full group-hover:bg-primary/90 transition-colors text-sm md:text-base">
                    Browse
                    <i className="fas fa-arrow-right ml-2 text-sm"></i>
                  </Button>
                </Link>
              </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No Categories Available
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Categories are being loaded. Please check back in a moment.
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Debug: {categories.length} total categories, {mainCategories.length} main categories
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}