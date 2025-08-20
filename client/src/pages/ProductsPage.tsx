import React, { useState, useEffect } from 'react';
import { Filter, Grid, List, Search, SlidersHorizontal } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Product3DGrid } from '../components/3D/Product3DGrid';
import { ShimmerBackground } from '../components/3D/ShimmerBackground';

const SAMPLE_PRODUCTS = [
  {
    id: '1',
    name: 'Rajkumari Diamond Ring',
    price: '₹4,77,000',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop',
    category: 'ring'
  },
  {
    id: '2',
    name: 'Devika Celestial Necklace',
    price: '₹3,51,000',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop',
    category: 'necklace'
  },
  {
    id: '3',
    name: 'Ananya Platinum Bracelet',
    price: '₹2,52,000',
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=400&fit=crop',
    category: 'bracelet'
  },
  {
    id: '4',
    name: 'Priyanka Royal Ring',
    price: '₹4,14,000',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop',
    category: 'ring'
  },
  {
    id: '5',
    name: 'Shreya Aurora Necklace',
    price: '₹5,67,000',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop',
    category: 'necklace'
  },
  {
    id: '6',
    name: 'Ishita Gold Bracelet',
    price: '₹2,97,000',
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=400&fit=crop',
    category: 'bracelet'
  },
];

export default function ProductsPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [sortBy, setSortBy] = useState<string>('featured');

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'ring', name: 'Rings' },
    { id: 'necklace', name: 'Necklaces' },
    { id: 'bracelet', name: 'Bracelets' },
    { id: 'earring', name: 'Earrings' },
  ];

  const sortOptions = [
    { id: 'featured', name: 'Featured' },
    { id: 'price-low', name: 'Price: Low to High' },
    { id: 'price-high', name: 'Price: High to Low' },
    { id: 'newest', name: 'Newest Arrivals' },
    { id: 'popular', name: 'Most Popular' },
  ];

  const filteredProducts = SAMPLE_PRODUCTS.filter(product => 
    selectedCategory === 'all' || product.category === selectedCategory
  );

  return (
    <div className="relative min-h-screen bg-black text-white">
      {/* Background */}
      <ShimmerBackground />
      
      <div className="relative z-10 pt-24">
        {/* Header */}
        <div className="container mx-auto px-4 mb-12">
          <div className={`text-center space-y-4 transform transition-all duration-1000 ${
            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <h1 className="text-6xl font-bold bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 bg-clip-text text-transparent">
              Luxury Collections
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Discover our complete range of exquisite jewelry pieces, each crafted with uncompromising attention to detail and premium materials.
            </p>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="container mx-auto px-4 mb-8">
          <div className="bg-gradient-to-r from-gray-900/80 to-black/80 backdrop-blur-xl rounded-2xl p-6 border border-amber-500/20">
            <div className="flex flex-wrap items-center justify-between gap-4">
              {/* Category Filters */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className={selectedCategory === category.id 
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-black font-semibold' 
                      : 'border-amber-500/30 text-amber-400 hover:bg-amber-500/10'
                    }
                    data-testid={`filter-${category.id}`}
                  >
                    {category.name}
                  </Button>
                ))}
              </div>

              {/* Controls */}
              <div className="flex items-center gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search jewelry..."
                    className="pl-10 pr-4 py-2 bg-black/50 border border-amber-500/30 rounded-lg text-white placeholder-gray-400 focus:border-amber-500 focus:outline-none"
                    data-testid="input-search"
                  />
                </div>

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 bg-black/50 border border-amber-500/30 rounded-lg text-white focus:border-amber-500 focus:outline-none"
                  data-testid="select-sort"
                >
                  {sortOptions.map((option) => (
                    <option key={option.id} value={option.id} className="bg-black">
                      {option.name}
                    </option>
                  ))}
                </select>

                {/* View Mode */}
                <div className="flex border border-amber-500/30 rounded-lg overflow-hidden">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className={viewMode === 'grid' ? 'bg-amber-500 text-black' : 'text-amber-400'}
                    data-testid="button-grid-view"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className={viewMode === 'list' ? 'bg-amber-500 text-black' : 'text-amber-400'}
                    data-testid="button-list-view"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                  data-testid="button-filters"
                >
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="container mx-auto px-4 pb-20">
          <div className={`transform transition-all duration-1000 delay-300 ${
            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
          }`}>
            {viewMode === 'grid' ? (
              <Product3DGrid products={filteredProducts} />
            ) : (
              <div className="space-y-6">
                {filteredProducts.map((product) => (
                  <Card key={product.id} className="bg-gradient-to-r from-gray-900/80 to-black/80 backdrop-blur-xl border-amber-500/20 hover:border-amber-400/60 transition-all duration-500">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-6">
                        <div className="w-32 h-32 bg-gradient-to-br from-amber-500/20 to-yellow-600/20 rounded-lg flex items-center justify-center">
                          <img src={product.image} alt={product.name} className="w-24 h-24 object-cover rounded-lg" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-white hover:text-amber-400 transition-colors">
                            {product.name}
                          </h3>
                          <p className="text-amber-400 font-semibold text-xl mt-2">{product.price}</p>
                          <p className="text-gray-300 mt-2">Handcrafted with premium materials and exceptional attention to detail.</p>
                        </div>
                        <div className="flex flex-col space-y-3">
                          <Button className="bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-black font-semibold px-8">
                            View Details
                          </Button>
                          <Button variant="outline" className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10 px-8">
                            Add to Cart
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}