import { type Product, type InsertProduct, type Category, type InsertCategory, type Order, type InsertOrder, type Testimonial, type InsertTestimonial, type BlogPost, type InsertBlogPost, type Review, type InsertReview, type User, type UpsertUser } from "@shared/schema";
import { nanoid } from "nanoid";

export interface IStorage {
  // Products
  getProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  getProductsByCategory(category: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: InsertProduct): Promise<Product>;
  deleteProduct(id: string): Promise<void>;
  deleteAllProducts(): Promise<void>;
  
  // Categories
  getCategories(): Promise<Category[]>;
  getCategory(id: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: string, category: InsertCategory): Promise<Category>;
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

  // Users
  getAllUsers(): Promise<User[]>;
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  createUser(user: UpsertUser): Promise<User>;
  updateUser(id: string, user: UpsertUser): Promise<User>;
  deleteUser(id: string): Promise<void>;

  // Admin analytics
  getAdminStats(days?: number): Promise<any>;
  getRevenueChartData(days?: number): Promise<any[]>;
  getOrdersChartData(days?: number): Promise<any[]>;
  getProductsChartData(days?: number): Promise<any[]>;
  getTopProducts(days?: number): Promise<any[]>;
  getRecentOrders(limit?: number): Promise<any[]>;
  getAnalytics(days?: number): Promise<any>;
}

export class MemStorage implements IStorage {
  private categories: Category[] = [];
  private products: Product[] = [];
  private orders: Order[] = [];
  private testimonials: Testimonial[] = [];
  private blogPosts: BlogPost[] = [];
  private reviews: Review[] = [];
  private users: User[] = [];

  constructor() {
    this.seedData();
  }

  private async seedData() {
    // Seed basic categories only for live business
    this.categories = [
      { id: "ott", name: "OTT Subscriptions", slug: "ott", description: "Premium video streaming platforms", icon: "fas fa-play-circle" },
      { id: "vpn", name: "VPN Services", slug: "vpn", description: "Secure browsing solutions", icon: "fas fa-shield-alt" },
      { id: "cloud", name: "Cloud Storage", slug: "cloud", description: "Cloud storage solutions", icon: "fas fa-cloud" },
      { id: "streaming", name: "Streaming Services", slug: "streaming", description: "Music and audio streaming", icon: "fas fa-music" },
    ];

    // Empty data for live business deployment
    this.products = [];
    this.orders = [];
    this.testimonials = [];
    this.blogPosts = [];
    this.reviews = [];
    this.users = [];


  }

  // Product methods
  async getProducts(): Promise<Product[]> {
    return [...this.products];
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
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.products.push(newProduct);
    return newProduct;
  }

  async updateProduct(id: string, product: InsertProduct): Promise<Product> {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Product not found');
    }
    
    this.products[index] = {
      ...this.products[index],
      ...product,
      updatedAt: new Date(),
    };
    return this.products[index];
  }

  async deleteProduct(id: string): Promise<void> {
    this.products = this.products.filter(p => p.id !== id);
  }

  async deleteAllProducts(): Promise<void> {
    this.products = [];
  }

  // Category methods
  async getCategories(): Promise<Category[]> {
    return [...this.categories];
  }

  async getCategory(id: string): Promise<Category | undefined> {
    return this.categories.find(c => c.id === id);
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const newCategory: Category = {
      id: nanoid(),
      ...category,
    };
    this.categories.push(newCategory);
    return newCategory;
  }

  async updateCategory(id: string, category: InsertCategory): Promise<Category> {
    const index = this.categories.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Category not found');
    }
    
    this.categories[index] = {
      ...this.categories[index],
      ...category,
    };
    return this.categories[index];
  }

  async deleteCategory(id: string): Promise<void> {
    this.categories = this.categories.filter(c => c.id !== id);
  }

  // Order methods
  async getOrders(): Promise<Order[]> {
    return [...this.orders];
  }

  async getOrder(id: string): Promise<Order | undefined> {
    return this.orders.find(o => o.id === id);
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const newOrder: Order = {
      id: nanoid(),
      ...order,
      createdAt: new Date(),
    };
    this.orders.push(newOrder);
    return newOrder;
  }

  async updateOrderStatus(id: string, status: string): Promise<Order> {
    const index = this.orders.findIndex(o => o.id === id);
    if (index === -1) {
      throw new Error('Order not found');
    }
    
    this.orders[index] = {
      ...this.orders[index],
      status,
    };
    return this.orders[index];
  }

  // Testimonial methods
  async getTestimonials(): Promise<Testimonial[]> {
    return [...this.testimonials];
  }

  async getFeaturedTestimonials(): Promise<Testimonial[]> {
    return this.testimonials.filter(t => t.isPublished);
  }

  // Blog methods
  async getBlogPosts(): Promise<BlogPost[]> {
    return [...this.blogPosts];
  }

  async getFeaturedBlogPosts(): Promise<BlogPost[]> {
    return this.blogPosts.filter(b => b.featured);
  }

  // Review methods
  async getReviews(): Promise<Review[]> {
    return [...this.reviews];
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
      ...review,
      createdAt: new Date(),
    };
    this.reviews.push(newReview);
    return newReview;
  }

  async updateReviewStatus(id: string, isPublished: boolean): Promise<void> {
    const index = this.reviews.findIndex(r => r.id === id);
    if (index !== -1) {
      this.reviews[index].isPublished = isPublished;
    }
  }

  // User methods
  async getAllUsers(): Promise<User[]> {
    return [...this.users];
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.find(user => user.id === id);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const existingIndex = this.users.findIndex(user => user.id === userData.id);
    
    if (existingIndex !== -1) {
      this.users[existingIndex] = {
        ...this.users[existingIndex],
        ...userData,
        updatedAt: new Date(),
      };
      return this.users[existingIndex];
    } else {
      const newUser: User = {
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.users.push(newUser);
      return newUser;
    }
  }

  async createUser(userData: UpsertUser): Promise<User> {
    const newUser: User = {
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.push(newUser);
    return newUser;
  }

  async updateUser(id: string, userData: UpsertUser): Promise<User> {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    this.users[userIndex] = {
      ...this.users[userIndex],
      ...userData,
      updatedAt: new Date(),
    };
    
    return this.users[userIndex];
  }

  async deleteUser(id: string): Promise<void> {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    this.users.splice(userIndex, 1);
  }
}

import { DatabaseStorage } from "./database-storage";

export const storage = new DatabaseStorage();