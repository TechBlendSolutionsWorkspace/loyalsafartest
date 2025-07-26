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
      { name: "OTT Services", slug: "ott", description: "Streaming platforms", icon: "fab fa-netflix" },
      { name: "AI Tools", slug: "ai", description: "AI-powered productivity tools", icon: "fas fa-robot" },
      { name: "VPN Services", slug: "vpn", description: "Secure browsing solutions", icon: "fas fa-shield-alt" },
      { name: "Web Designing", slug: "web", description: "Design and development tools", icon: "fas fa-code" },
      { name: "Vouchers", slug: "vouchers", description: "Gift cards and vouchers", icon: "fas fa-gift" },
      { name: "Cloud Storage", slug: "cloud", description: "Cloud storage solutions", icon: "fas fa-cloud" },
      { name: "Software", slug: "software", description: "Premium software licenses", icon: "fas fa-laptop" },
      { name: "Social Media Growth", slug: "social", description: "Social media tools", icon: "fas fa-users" },
      { name: "Gaming Software", slug: "gaming", description: "Gaming platforms and tools", icon: "fas fa-gamepad" },
      { name: "Marketing", slug: "marketing", description: "Marketing and analytics tools", icon: "fas fa-chart-line" },
      { name: "Courses", slug: "courses", description: "Online learning platforms", icon: "fas fa-graduation-cap" },
      { name: "Bundles", slug: "bundles", description: "Combo packages", icon: "fas fa-box" },
    ];

    categories.forEach(cat => this.createCategory(cat));

    // Seed products
    const products: InsertProduct[] = [
      {
        name: "Netflix Premium",
        description: "Ultra HD streaming, 4 screens, offline downloads",
        price: 99,
        originalPrice: 649,
        discount: 85,
        category: "ott",
        icon: "fab fa-netflix",
        image: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        popular: true,
        trending: false,
        available: true,
      },
      {
        name: "ChatGPT Plus",
        description: "GPT-4 access, faster responses, priority access",
        price: 299,
        originalPrice: 1500,
        discount: 80,
        category: "ai",
        icon: "fas fa-robot",
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        popular: false,
        trending: true,
        available: true,
      },
      {
        name: "Canva Pro",
        description: "Premium templates, brand kit, background remover",
        price: 199,
        originalPrice: 1000,
        discount: 80,
        category: "ai",
        icon: "fas fa-palette",
        image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        popular: false,
        trending: false,
        available: true,
      },
      {
        name: "Google Drive 2TB",
        description: "2TB secure cloud storage, file sharing, backup",
        price: 149,
        originalPrice: 650,
        discount: 77,
        category: "cloud",
        icon: "fab fa-google-drive",
        image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        popular: false,
        trending: false,
        available: true,
      },
      {
        name: "Office 365",
        description: "Word, Excel, PowerPoint, Teams, OneDrive",
        price: 399,
        originalPrice: 2000,
        discount: 80,
        category: "software",
        icon: "fab fa-microsoft",
        image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        popular: false,
        trending: false,
        available: true,
      },
      {
        name: "Prime Video",
        description: "Movies, series, Prime exclusive content",
        price: 79,
        originalPrice: 499,
        discount: 84,
        category: "ott",
        icon: "fab fa-amazon",
        image: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        popular: false,
        trending: false,
        available: true,
      },
      {
        name: "Premium VPN",
        description: "Secure browsing, global servers, no logs",
        price: 129,
        originalPrice: 800,
        discount: 84,
        category: "vpn",
        icon: "fas fa-shield-alt",
        image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        popular: false,
        trending: false,
        available: true,
      },
      {
        name: "Disney+ Hotstar",
        description: "Disney, Marvel, Star Wars, live sports",
        price: 89,
        originalPrice: 499,
        discount: 82,
        category: "ott",
        icon: "fas fa-play-circle",
        image: "https://images.unsplash.com/photo-1489599162771-a5a3cf410ee5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        popular: false,
        trending: false,
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
      this.testimonials.set(id, { ...testimonial, id });
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
      this.blogPosts.set(id, { ...post, id });
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
    const product: Product = { ...insertProduct, id };
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
    const category: Category = { ...insertCategory, id };
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
    const order: Order = { ...insertOrder, id, createdAt: new Date().toISOString() };
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
