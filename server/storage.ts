import { type Product, type InsertProduct, type Category, type InsertCategory, type Order, type InsertOrder, type Testimonial, type InsertTestimonial, type BlogPost, type InsertBlogPost } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Products
  getProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  getProductsByCategory(category: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  
  // Categories
  getCategories(): Promise<Category[]>;
  getCategory(id: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Orders
  getOrders(): Promise<Order[]>;
  getOrder(id: string): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  
  // Testimonials
  getTestimonials(): Promise<Testimonial[]>;
  getFeaturedTestimonials(): Promise<Testimonial[]>;
  
  // Blog Posts
  getBlogPosts(): Promise<BlogPost[]>;
  getFeaturedBlogPosts(): Promise<BlogPost[]>;
}

export class MemStorage implements IStorage {
  private products: Map<string, Product>;
  private categories: Map<string, Category>;
  private orders: Map<string, Order>;
  private testimonials: Map<string, Testimonial>;
  private blogPosts: Map<string, BlogPost>;

  constructor() {
    this.products = new Map();
    this.categories = new Map();
    this.orders = new Map();
    this.testimonials = new Map();
    this.blogPosts = new Map();
    
    this.seedData();
  }

  private seedData() {
    // Seed categories
    const categories: InsertCategory[] = [
      { name: "OTT Subscriptions", slug: "ott", description: "Premium streaming platforms", icon: "fas fa-play-circle" },
      { name: "VPN Services", slug: "vpn", description: "Secure browsing solutions", icon: "fas fa-shield-alt" },
      { name: "Cloud Storage", slug: "cloud", description: "Cloud storage solutions", icon: "fas fa-cloud" },
      { name: "Streaming Services", slug: "streaming", description: "Music and audio streaming", icon: "fas fa-music" },
    ];

    categories.forEach(cat => this.createCategory(cat));

    // Seed products from CSV data
    const products: InsertProduct[] = [
      // Streaming Services
      {
        name: "Spotify Premium",
        fullProductName: "Spotify - 1 Month",
        subcategory: "Spotify",
        duration: "1 Month",
        description: "Premium music streaming with ad-free experience",
        features: "Premium Streaming, Ad-Free, High Quality",
        price: 79,
        originalPrice: 129,
        discount: 39,
        category: "streaming",
        icon: "fab fa-spotify",
        image: "https://images.unsplash.com/photo-1611339555312-e607c8352fd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        activationTime: "Within 1-2 Hrs",
        warranty: "30 Days",
        notes: "",
        popular: true,
        trending: false,
        available: true,
      },
      {
        name: "Spotify Premium",
        fullProductName: "Spotify - 3 Months (New Mail Only)",
        subcategory: "Spotify",
        duration: "3 Months",
        description: "Premium music streaming for new accounts only",
        features: "Only for New Mail, Premium Quality",
        price: 149,
        originalPrice: 389,
        discount: 62,
        category: "streaming",
        icon: "fab fa-spotify",
        image: "https://images.unsplash.com/photo-1611339555312-e607c8352fd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        activationTime: "Within 1-2 Hrs",
        warranty: "90 Days",
        notes: "New Email Required",
        popular: false,
        trending: true,
        available: true,
      },
      {
        name: "YouTube Music Premium",
        fullProductName: "YouTube Music - 1 Month",
        subcategory: "YouTube Music",
        duration: "1 Month",
        description: "Ad-free music streaming with YouTube Premium included",
        features: "Includes YT Premium, Ad-Free Music",
        price: 49,
        originalPrice: 129,
        discount: 62,
        category: "streaming",
        icon: "fab fa-youtube",
        image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        activationTime: "Within 1-2 Hrs",
        warranty: "30 Days",
        notes: "",
        popular: false,
        trending: false,
        available: true,
      },
      // VPN Services
      {
        name: "Surfshark VPN",
        fullProductName: "Surfshark - 1 Month (1 Device)",
        subcategory: "Surfshark",
        duration: "1 Month",
        description: "High-speed VPN with secure browsing",
        features: "1 Device, High-Speed VPN Access",
        price: 149,
        originalPrice: 429,
        discount: 65,
        category: "vpn",
        icon: "fas fa-shield-alt",
        image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        activationTime: "Within 1-2 Hrs",
        warranty: "30 Days",
        notes: "",
        popular: false,
        trending: false,
        available: true,
      },
      {
        name: "NordVPN",
        fullProductName: "NordVPN - 1 Month (1 Device)",
        subcategory: "NordVPN",
        duration: "1 Month",
        description: "Premium VPN with AES-256 encryption",
        features: "1 Device, AES-256 Encryption",
        price: 169,
        originalPrice: 529,
        discount: 68,
        category: "vpn",
        icon: "fas fa-shield-alt",
        image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        activationTime: "Within 1-2 Hrs",
        warranty: "30 Days",
        notes: "",
        popular: true,
        trending: false,
        available: true,
      },
      // Cloud Storage
      {
        name: "Google Cloud Storage",
        fullProductName: "Google Storage - 100GB (6 Months)",
        subcategory: "Google Storage",
        duration: "6 Months",
        description: "100GB secure cloud storage linked to Gmail",
        features: "100GB Cloud Storage, Linked to Gmail",
        price: 499,
        originalPrice: 780,
        discount: 36,
        category: "cloud",
        icon: "fab fa-google-drive",
        image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        activationTime: "Within 1-2 Hrs",
        warranty: "180 Days",
        notes: "",
        popular: false,
        trending: false,
        available: true,
      },
      {
        name: "TeraBox Cloud",
        fullProductName: "TeraBox - 1TB (1 Month)",
        subcategory: "TeraBox",
        duration: "1 Month",
        description: "1TB secure cloud storage with fast speeds",
        features: "1TB Secure Cloud, Fast Upload/Download",
        price: 49,
        originalPrice: 149,
        discount: 67,
        category: "cloud",
        icon: "fas fa-cloud",
        image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        activationTime: "Within 1-2 Hrs",
        warranty: "30 Days",
        notes: "",
        popular: false,
        trending: true,
        available: true,
      },
    ];

    products.forEach(product => this.createProduct(product));

    // Seed testimonials
    const testimonials: InsertTestimonial[] = [
      {
        name: "Rahul Sharma",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=80",
        rating: 5,
        review: "Got Netflix Premium for just ₹99! Works perfectly, instant delivery. Highly recommended service.",
        featured: true,
      },
      {
        name: "Priya Patel",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b48d7e73?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=80",
        rating: 5,
        review: "Amazing prices for ChatGPT Plus! Saved hundreds of rupees. Customer support is excellent.",
        featured: true,
      },
      {
        name: "Arjun Singh",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=80",
        rating: 5,
        review: "Been using their services for 6 months. All accounts work perfectly. Very reliable!",
        featured: true,
      },
    ];

    testimonials.forEach(testimonial => {
      const id = randomUUID();
      this.testimonials.set(id, { ...testimonial, id, featured: testimonial.featured ?? false });
    });

    // Seed blog posts
    const blogPosts: InsertBlogPost[] = [
      {
        title: "Top 10 AI Tools Every Creator Needs in 2024",
        slug: "top-ai-tools-creators-2024",
        excerpt: "Discover the most powerful AI tools that can revolutionize your creative workflow and boost productivity.",
        content: "Full blog post content here...",
        image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        category: "AI TOOLS",
        featured: true,
      },
      {
        title: "How to Use Shared OTT Subscriptions Safely",
        slug: "shared-ott-subscriptions-safely",
        excerpt: "Learn the best practices for using shared streaming accounts while maintaining security and compliance.",
        content: "Full blog post content here...",
        image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        category: "STREAMING",
        featured: true,
      },
      {
        title: "Cloud Storage Solutions: Which One is Right for You?",
        slug: "cloud-storage-solutions-guide",
        excerpt: "Compare different cloud storage options and find the perfect solution for your personal or business needs.",
        content: "Full blog post content here...",
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        category: "PRODUCTIVITY",
        featured: true,
      },
    ];

    blogPosts.forEach(post => {
      const id = randomUUID();
      this.blogPosts.set(id, { 
        ...post, 
        id, 
        createdAt: new Date().toISOString(),
        featured: post.featured ?? false 
      });
    });
  }

  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(product => product.category === category);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const product: Product = { 
      ...insertProduct, 
      id,
      notes: insertProduct.notes ?? null,
      popular: insertProduct.popular ?? false,
      trending: insertProduct.trending ?? false,
      available: insertProduct.available ?? true
    };
    this.products.set(id, product);
    return product;
  }

  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategory(id: string): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = randomUUID();
    const category: Category = { 
      ...insertCategory, 
      id,
      description: insertCategory.description ?? null
    };
    this.categories.set(id, category);
    return category;
  }

  async getOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }

  async getOrder(id: string): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = randomUUID();
    const order: Order = { 
      ...insertOrder, 
      id, 
      createdAt: new Date().toISOString(),
      status: insertOrder.status ?? "pending",
      whatsappSent: insertOrder.whatsappSent ?? false
    };
    this.orders.set(id, order);
    return order;
  }

  async getTestimonials(): Promise<Testimonial[]> {
    return Array.from(this.testimonials.values());
  }

  async getFeaturedTestimonials(): Promise<Testimonial[]> {
    return Array.from(this.testimonials.values()).filter(testimonial => testimonial.featured);
  }

  async getBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values());
  }

  async getFeaturedBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values()).filter(post => post.featured);
  }
}

export const storage = new MemStorage();
