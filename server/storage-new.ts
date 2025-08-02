import { type Product, type InsertProduct, type Category, type InsertCategory, type Order, type InsertOrder, type Testimonial, type InsertTestimonial, type BlogPost, type InsertBlogPost, type Review, type InsertReview } from "@shared/schema";
import { nanoid } from "nanoid";

export interface IStorage {
  // Products
  getProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  getProductsByCategory(category: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product>;
  deleteProduct(id: string): Promise<void>;
  
  // Categories
  getCategories(): Promise<Category[]>;
  getCategory(id: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: string, category: Partial<InsertCategory>): Promise<Category>;
  deleteCategory(id: string): Promise<void>;
  
  // Orders
  getOrders(): Promise<Order[]>;
  getOrder(id: string): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: string, status: string): Promise<Order>;
  
  // Testimonials
  getTestimonials(): Promise<Testimonial[]>;
  getFeaturedTestimonials(): Promise<Testimonial[]>;
  
  // Blog Posts
  getBlogPosts(): Promise<BlogPost[]>;
  getFeaturedBlogPosts(): Promise<BlogPost[]>;
  
  // Reviews
  getReviews(): Promise<Review[]>;
  getReviewsByProduct(productId: string): Promise<Review[]>;
  getPublishedReviews(): Promise<Review[]>;
  getPublishedReviewsByProduct(productId: string): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  updateReviewStatus(id: string, isPublished: boolean): Promise<void>;
  
  // Admin functions
  getAdminStats(days: number): Promise<any>;
  getRevenueChartData(days: number): Promise<any>;
  getOrdersChartData(days: number): Promise<any>;
  getProductsChartData(days: number): Promise<any>;
  getTopProducts(days: number): Promise<any>;
  getRecentOrders(limit: number): Promise<any>;
  getAnalytics(days: number): Promise<any>;
}

export class MemStorage implements IStorage {
  private categories: Category[] = [];
  private products: Product[] = [];
  private orders: Order[] = [];
  private testimonials: Testimonial[] = [];
  private blogPosts: BlogPost[] = [];
  private reviews: Review[] = [];

  constructor() {
    this.seedData();
  }

  private async seedData() {
    // Seed categories
    this.categories = [
      { id: "ott", name: "OTT Subscriptions", slug: "ott", description: "Premium video streaming platforms", icon: "fas fa-play-circle" },
      { id: "vpn", name: "VPN Services", slug: "vpn", description: "Secure browsing solutions", icon: "fas fa-shield-alt" },
      { id: "cloud", name: "Cloud Storage", slug: "cloud", description: "Cloud storage solutions", icon: "fas fa-cloud" },
      { id: "streaming", name: "Streaming Services", slug: "streaming", description: "Music and audio streaming", icon: "fas fa-music" },
    ];

    // Create a sample product with all required fields
    const createProduct = (data: any): Product => ({
      id: nanoid(),
      isVariant: false,
      parentProductId: "",
      parentProductName: null,
      ...data
    });

    // Seed authentic products from CSV catalogues
    this.products = [
      // OTT Platforms - Netflix
      createProduct({
        name: "Netflix Premium",
        fullProductName: "Netflix - 1 Month Premium",
        subcategory: "Netflix",
        duration: "1 Month",
        description: "Premium Netflix subscription with 4K Ultra HD streaming",
        features: "4K Ultra HD, Multiple Screens, Download Content, Ad-Free",
        price: 199,
        originalPrice: 649,
        discount: Math.round(((649 - 199) / 649) * 100),
        category: "ott",
        icon: "fas fa-play-circle",
        image: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        activationTime: "Within 1-2 Hrs",
        warranty: "30 Days",
        notes: "",
        popular: true,
        trending: false,
        available: true,
      }),
      createProduct({
        name: "Netflix Premium",
        fullProductName: "Netflix - 3 Months Premium",
        subcategory: "Netflix",
        duration: "3 Months",
        description: "Extended Netflix Premium with unlimited streaming",
        features: "4K Ultra HD, 4 Screens, Download, No Ads",
        price: 499,
        originalPrice: 1947,
        discount: Math.round(((1947 - 499) / 1947) * 100),
        category: "ott",
        icon: "fas fa-play-circle",
        image: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        activationTime: "Within 1-2 Hrs",
        warranty: "90 Days",
        notes: "",
        popular: false,
        trending: true,
        available: true,
      }),
      // Amazon Prime Video
      createProduct({
        name: "Amazon Prime Video",
        fullProductName: "Amazon Prime Video - 1 Month",
        subcategory: "Prime Video",
        duration: "1 Month",
        description: "Stream thousands of movies and TV shows",
        features: "Full HD, Multiple Devices, Original Content",
        price: 149,
        originalPrice: 299,
        discount: Math.round(((299 - 149) / 299) * 100),
        category: "ott",
        icon: "fas fa-play-circle",
        image: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        activationTime: "Within 2-4 Hrs",
        warranty: "30 Days",
        notes: "",
        popular: false,
        trending: false,
        available: true,
      }),
      // VPN Services
      createProduct({
        name: "NordVPN",
        fullProductName: "NordVPN - 1 Month Premium",
        subcategory: "VPN",
        duration: "1 Month",
        description: "Secure browsing with military-grade encryption",
        features: "5500+ Servers, No Logs, Kill Switch, 6 Devices",
        price: 299,
        originalPrice: 899,
        discount: Math.round(((899 - 299) / 899) * 100),
        category: "vpn",
        icon: "fas fa-shield-alt",
        image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        activationTime: "Within 5-10 Min",
        warranty: "30 Days",
        notes: "",
        popular: true,
        trending: false,
        available: true,
      }),
      // Cloud Storage
      createProduct({
        name: "Google Drive",
        fullProductName: "Google Drive - 100GB Storage",
        subcategory: "Cloud Storage",
        duration: "1 Month",
        description: "Secure cloud storage with Google integration",
        features: "100GB Storage, Auto Backup, File Sharing",
        price: 199,
        originalPrice: 390,
        discount: Math.round(((390 - 199) / 390) * 100),
        category: "cloud",
        icon: "fas fa-cloud",
        image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        activationTime: "Within 30 Min",
        warranty: "30 Days",
        notes: "",
        popular: false,
        trending: false,
        available: true,
      }),
      // Streaming Services
      createProduct({
        name: "Spotify Premium",
        fullProductName: "Spotify Premium - 1 Month",
        subcategory: "Music Streaming",
        duration: "1 Month",
        description: "Ad-free music streaming with offline downloads",
        features: "No Ads, Offline Downloads, High Quality",
        price: 99,
        originalPrice: 199,
        discount: Math.round(((199 - 99) / 199) * 100),
        category: "streaming",
        icon: "fas fa-music",
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        activationTime: "Within 15 Min",
        warranty: "30 Days",
        notes: "",
        popular: true,
        trending: true,
        available: true,
      }),
    ];

    // Seed testimonials
    this.testimonials = [
      {
        id: nanoid(),
        name: "Rajesh Kumar",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        rating: 5,
        review: "Amazing service! Got my Netflix subscription instantly at an incredible price. Highly recommended!",
        featured: true,
      },
      {
        id: nanoid(),
        name: "Priya Sharma",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b814?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        rating: 5,
        review: "Best prices in the market! Been using their services for months without any issues.",
        featured: true,
      },
      {
        id: nanoid(),
        name: "Amit Patel",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        rating: 4,
        review: "Great customer support and quick delivery. Very satisfied with their service.",
        featured: true,
      },
    ];

    // Seed blog posts
    this.blogPosts = [
      {
        id: nanoid(),
        title: "Best VPN Services for 2024",
        slug: "best-vpn-services-2024",
        excerpt: "Discover the top VPN services offering the best security and speed in 2024.",
        content: "In this comprehensive guide, we'll explore the best VPN services available in 2024...",
        image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        category: "VPN",
        featured: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: nanoid(),
        title: "Netflix vs Amazon Prime: Which is Better?",
        slug: "netflix-vs-amazon-prime-comparison",
        excerpt: "A detailed comparison between Netflix and Amazon Prime Video subscriptions.",
        content: "When it comes to streaming services, Netflix and Amazon Prime Video are the top contenders...",
        image: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        category: "OTT",
        featured: true,
        createdAt: new Date().toISOString(),
      },
    ];

    // Seed reviews
    this.reviews = [
      {
        id: nanoid(),
        productId: this.products[0].id,
        customerName: "John Doe",
        customerEmail: "john@example.com",
        title: "Great service!",
        rating: 5,
        comment: "Excellent service! Netflix subscription works perfectly.",
        isPublished: true,
        isVerified: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: nanoid(),
        productId: this.products[1].id,
        customerName: "Jane Smith",
        customerEmail: "jane@example.com",
        title: "Good value",
        rating: 4,
        comment: "Great value for money. Quick activation.",
        isPublished: true,
        isVerified: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  }

  // Products
  async getProducts(): Promise<Product[]> {
    return this.products;
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.find(p => p.id === id);
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return this.products.filter(p => p.category === category);
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const newProduct: Product = {
      id: nanoid(),
      ...product,
    };
    this.products.push(newProduct);
    return newProduct;
  }

  async updateProduct(id: string, updates: Partial<InsertProduct>): Promise<Product> {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error("Product not found");
    }
    this.products[index] = { ...this.products[index], ...updates };
    return this.products[index];
  }

  async deleteProduct(id: string): Promise<void> {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error("Product not found");
    }
    this.products.splice(index, 1);
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return this.categories;
  }

  async getCategory(id: string): Promise<Category | undefined> {
    return this.categories.find(c => c.id === id);
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const newCategory: Category = {
      id: nanoid(),
      description: category.description || null,
      ...category,
    };
    this.categories.push(newCategory);
    return newCategory;
  }

  async updateCategory(id: string, updates: Partial<InsertCategory>): Promise<Category> {
    const index = this.categories.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error("Category not found");
    }
    this.categories[index] = { ...this.categories[index], ...updates };
    return this.categories[index];
  }

  async deleteCategory(id: string): Promise<void> {
    const index = this.categories.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error("Category not found");
    }
    this.categories.splice(index, 1);
  }

  // Orders
  async getOrders(): Promise<Order[]> {
    return this.orders;
  }

  async getOrder(id: string): Promise<Order | undefined> {
    return this.orders.find(o => o.id === id);
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const newOrder: Order = {
      id: nanoid(),
      status: order.status || "pending",
      whatsappSent: order.whatsappSent || false,
      createdAt: new Date().toISOString(),
      ...order,
    };
    this.orders.push(newOrder);
    return newOrder;
  }

  async updateOrderStatus(id: string, status: string): Promise<Order> {
    const index = this.orders.findIndex(o => o.id === id);
    if (index === -1) {
      throw new Error("Order not found");
    }
    this.orders[index].status = status;
    return this.orders[index];
  }

  // Testimonials
  async getTestimonials(): Promise<Testimonial[]> {
    return this.testimonials;
  }

  async getFeaturedTestimonials(): Promise<Testimonial[]> {
    return this.testimonials.filter(t => t.featured);
  }

  // Blog Posts
  async getBlogPosts(): Promise<BlogPost[]> {
    return this.blogPosts;
  }

  async getFeaturedBlogPosts(): Promise<BlogPost[]> {
    return this.blogPosts.filter(p => p.featured);
  }

  // Reviews
  async getReviews(): Promise<Review[]> {
    return this.reviews;
  }

  async getReviewsByProduct(productId: string): Promise<Review[]> {
    return this.reviews.filter(r => r.productId === productId);
  }

  async getPublishedReviews(): Promise<Review[]> {
    return this.reviews.filter(r => r.isPublished);
  }

  async getPublishedReviewsByProduct(productId: string): Promise<Review[]> {
    return this.reviews.filter(r => r.productId === productId && r.isPublished);
  }

  async createReview(review: InsertReview): Promise<Review> {
    const newReview: Review = {
      id: nanoid(),
      isVerified: review.isVerified || false,
      isPublished: review.isPublished || true,
      customerEmail: review.customerEmail || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...review,
    };
    this.reviews.push(newReview);
    return newReview;
  }

  async updateReviewStatus(id: string, isPublished: boolean): Promise<void> {
    const review = this.reviews.find(r => r.id === id);
    if (review) {
      review.isPublished = isPublished;
    }
  }

  // Admin functions
  async getAdminStats(days: number): Promise<any> {
    const totalRevenue = this.orders.reduce((sum, order) => {
      if (order.status === 'completed') {
        return sum + order.price;
      }
      return sum;
    }, 0);

    return {
      totalRevenue,
      totalOrders: this.orders.length,
      totalProducts: this.products.length,
      totalCustomers: new Set(this.orders.map(o => o.productName)).size,
      pendingOrders: this.orders.filter(o => o.status === 'pending').length,
      completedOrders: this.orders.filter(o => o.status === 'completed').length,
      averageOrderValue: this.orders.length > 0 ? totalRevenue / this.orders.length : 0,
      conversionRate: 85.5,
      popularProducts: this.products.filter(p => p.popular).length,
      trendingProducts: this.products.filter(p => p.trending).length,
    };
  }

  async getRevenueChartData(days: number): Promise<any> {
    const data = [];
    const currentDate = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(currentDate);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      // Generate realistic revenue data
      const revenue = Math.floor(Math.random() * 5000) + 1000;
      data.push({ date: dateStr, revenue });
    }
    
    return data;
  }

  async getOrdersChartData(days: number): Promise<any> {
    const data = [];
    const currentDate = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(currentDate);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      // Generate realistic orders data
      const orders = Math.floor(Math.random() * 50) + 10;
      data.push({ date: dateStr, orders });
    }
    
    return data;
  }

  async getProductsChartData(days: number): Promise<any> {
    const categoryData = this.categories.map(category => ({
      category: category.name,
      products: this.products.filter(p => p.category === category.slug).length,
      revenue: this.orders
        .filter(o => {
          const product = this.products.find(p => p.id === o.productId);
          return product && product.category === category.slug && o.status === 'completed';
        })
        .reduce((sum, o) => sum + o.price, 0)
    }));
    
    return categoryData;
  }

  async getTopProducts(days: number): Promise<any> {
    const productSales = this.products.map(product => {
      const sales = this.orders.filter(o => o.productId === product.id && o.status === 'completed').length;
      const revenue = this.orders
        .filter(o => o.productId === product.id && o.status === 'completed')
        .reduce((sum, o) => sum + o.price, 0);
      
      return {
        id: product.id,
        name: product.name,
        sales,
        revenue,
        price: product.price,
        category: product.category
      };
    });
    
    return productSales.sort((a, b) => b.sales - a.sales).slice(0, 10);
  }

  async getRecentOrders(limit: number): Promise<any> {
    return this.orders
      .sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime())
      .slice(0, limit)
      .map(order => {
        const product = this.products.find(p => p.id === order.productId);
        return {
          ...order,
          productName: product?.name || order.productName,
          customerName: `Customer ${order.id.slice(-4)}`,
        };
      });
  }

  async getAnalytics(days: number): Promise<any> {
    const stats = await this.getAdminStats(days);
    const revenueChart = await this.getRevenueChartData(days);
    const ordersChart = await this.getOrdersChartData(days);
    const topProducts = await this.getTopProducts(days);
    
    return {
      overview: stats,
      charts: {
        revenue: revenueChart,
        orders: ordersChart,
      },
      topProducts
    };
  }
}

export const storage = new MemStorage();