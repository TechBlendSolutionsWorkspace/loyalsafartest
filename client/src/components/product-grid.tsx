import { Link } from "wouter";
import { Product, Category } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { ServiceIconComponent } from "@/components/service-icons";


interface ProductGridProps {
  products: Product[];
  categories: Category[];
  isLoading: boolean;
}

export default function ProductGrid({ products, categories, isLoading }: ProductGridProps) {
  const featuredProducts = products.filter(product => product.popular || product.trending);

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
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 dark:bg-gray-700 h-48 rounded-xl mb-4"></div>
                  <div className="bg-gray-200 dark:bg-gray-700 h-6 rounded mb-2"></div>
                  <div className="bg-gray-200 dark:bg-gray-700 h-4 rounded"></div>
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
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 dark:bg-gray-700 h-48 rounded-xl mb-4"></div>
                  <div className="bg-gray-200 dark:bg-gray-700 h-6 rounded mb-2"></div>
                  <div className="bg-gray-200 dark:bg-gray-700 h-4 rounded"></div>
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
      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-8 md:py-16 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 md:mb-4">
                Popular & Trending Services
              </h2>
              <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto px-4">
                India's favorite digital services at the most affordable prices
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
              {featuredProducts.slice(0, 6).map((product) => (
                <div key={product.id} className="business-card rounded-xl p-4 sm:p-6 hover:shadow-xl transition-all duration-300">
                  <div className="relative mb-4">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <div className="absolute top-3 left-3">
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${
                        product.popular ? 'bg-orange-500' : 'bg-blue-500'
                      }`}>
                        {product.popular ? 'Popular' : 'Trending'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mb-2">
                    <ServiceIconComponent serviceName={product.name} className="flex-shrink-0" />
                    <h3 className="text-xl font-bold line-clamp-1">{product.name}</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-primary">₹{product.price}</span>
                      <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
                    </div>
                    <div className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 px-2 py-1 rounded text-xs font-semibold">
                      {product.discount}% OFF
                    </div>
                  </div>
                  <Link href={`/product/${product.name.toLowerCase().replace(/\s+/g, '-')}`}>
                    <Button className="w-full font-semibold">
                      View Plans
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Service Categories */}
      <section id="categories" className="py-8 md:py-16">
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
            {categories.map((category) => (
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
                    Browse {category.name}
                    <i className="fas fa-arrow-right ml-2 text-sm"></i>
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}