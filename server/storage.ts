import { type Product, type InsertProduct, type Category, type InsertCategory, type Order, type InsertOrder, type Testimonial, type InsertTestimonial, type BlogPost, type InsertBlogPost, products, categories, orders, testimonials, blogPosts } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

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

export class DatabaseStorage implements IStorage {
  constructor() {
    this.seedData();
  }

  private async seedData() {
    try {
      // Check if data already exists
      const existingCategories = await db.select().from(categories).limit(1);
      if (existingCategories.length > 0) {
        return; // Data already seeded
      }

      // Seed categories
      const categoryData: InsertCategory[] = [
        { name: "OTT Subscriptions", slug: "ott", description: "Premium streaming platforms", icon: "fas fa-play-circle" },
        { name: "VPN Services", slug: "vpn", description: "Secure browsing solutions", icon: "fas fa-shield-alt" },
        { name: "Cloud Storage", slug: "cloud", description: "Cloud storage solutions", icon: "fas fa-cloud" },
        { name: "Streaming Services", slug: "streaming", description: "Music and audio streaming", icon: "fas fa-music" },
      ];

      await db.insert(categories).values(categoryData);

      // Seed products from CSV data
      const productData: InsertProduct[] = [
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
        // OTT Subscriptions
        {
          name: "Netflix Premium",
          fullProductName: "Netflix - 1 Month Screen Sharing",
          subcategory: "Netflix",
          duration: "1 Month",
          description: "Premium Netflix subscription with 4K streaming",
          features: "4K Ultra HD, 4 Screens, Screen Sharing",
          price: 99,
          originalPrice: 649,
          discount: 85,
          category: "ott",
          icon: "fab fa-youtube",
          image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
          activationTime: "Within 1-2 Hrs",
          warranty: "30 Days",
          notes: "",
          popular: true,
          trending: false,
          available: true,
        },
        {
          name: "Disney+ Hotstar",
          fullProductName: "Disney+ Hotstar VIP - 1 Year",
          subcategory: "Disney+ Hotstar",
          duration: "1 Year",
          description: "Complete entertainment with sports and movies",
          features: "Live Sports, Movies, TV Shows, VIP Content",
          price: 399,
          originalPrice: 899,
          discount: 56,
          category: "ott",
          icon: "fas fa-play-circle",
          image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
          activationTime: "Within 1-2 Hrs",
          warranty: "365 Days",
          notes: "",
          popular: false,
          trending: true,
          available: true,
        },
        {
          name: "Amazon Prime Video",
          fullProductName: "Amazon Prime Video - 3 Months",
          subcategory: "Amazon Prime",
          duration: "3 Months",
          description: "Prime Video with exclusive content and movies",
          features: "HD Streaming, Prime Originals, Movie Library",
          price: 199,
          originalPrice: 459,
          discount: 57,
          category: "ott",
          icon: "fab fa-amazon",
          image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
          activationTime: "Within 1-2 Hrs",
          warranty: "90 Days",
          notes: "",
          popular: false,
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

      await db.insert(products).values(productData);

      // Seed testimonials
      const testimonialData: InsertTestimonial[] = [
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

      await db.insert(testimonials).values(testimonialData);

      // Seed blog posts
      const blogPostData: InsertBlogPost[] = [
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

      await db.insert(blogPosts).values(blogPostData);
    } catch (error) {
      console.error("Error seeding data:", error);
    }
  }

  async getProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product || undefined;
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.category, category));
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db
      .insert(products)
      .values(insertProduct)
      .returning();
    return product;
  }

  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories);
  }

  async getCategory(id: string): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category || undefined;
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const [category] = await db
      .insert(categories)
      .values(insertCategory)
      .returning();
    return category;
  }

  async getOrders(): Promise<Order[]> {
    return await db.select().from(orders);
  }

  async getOrder(id: string): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order || undefined;
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const [order] = await db
      .insert(orders)
      .values(insertOrder)
      .returning();
    return order;
  }

  async getTestimonials(): Promise<Testimonial[]> {
    return await db.select().from(testimonials);
  }

  async getFeaturedTestimonials(): Promise<Testimonial[]> {
    return await db.select().from(testimonials).where(eq(testimonials.featured, true));
  }

  async getBlogPosts(): Promise<BlogPost[]> {
    return await db.select().from(blogPosts);
  }

  async getFeaturedBlogPosts(): Promise<BlogPost[]> {
    return await db.select().from(blogPosts).where(eq(blogPosts.featured, true));
  }
}

export const storage = new DatabaseStorage();