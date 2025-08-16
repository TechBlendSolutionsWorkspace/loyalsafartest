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
  getUserByEmail(email: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  createUser(user: UpsertUser): Promise<User>;
  updateUser(id: string, user: UpsertUser): Promise<User>;
  deleteUser(id: string): Promise<void>;
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
    // Clean slate - no seed data
  }

  // Product methods
  async getProducts(): Promise<Product[]> {
    return [...this.products];
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.find(p => p.id === id);
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return this.products.filter(p => p.categoryId === category);
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const newProduct: Product = {
      ...product,
      id: nanoid(),
      createdAt: new Date(),
      updatedAt: new Date()
    } as Product;
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
      name: category.name,
      slug: category.slug,
      createdAt: new Date(),
      updatedAt: new Date(),
      description: category.description || null,
      icon: category.icon || null,
      image: category.image || null,
      isSubcategory: category.isSubcategory || null,
      parentCategoryId: category.parentCategoryId || null,
      sortOrder: category.sortOrder || null,
      isActive: category.isActive || null,
      bannerImage: category.bannerImage || null,
      bannerTitle: category.bannerTitle || null,
      bannerSubtitle: category.bannerSubtitle || null
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
      updatedAt: new Date(),
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
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone,
      productId: order.productId,
      productName: order.productName,
      productPrice: order.productPrice,
      totalAmount: order.totalAmount,
      paymentMethod: order.paymentMethod,
      orderStatus: order.orderStatus,
      createdAt: new Date(),
      updatedAt: new Date(),
      notes: order.notes ?? null,
      deliveryDetails: order.deliveryDetails || null
    };
    this.orders.push(newOrder);
    return newOrder;
  }

  async updateOrderStatus(id: string, status: string): Promise<Order> {
    const order = this.orders.find(o => o.id === id);
    if (!order) {
      throw new Error('Order not found');
    }
    
    order.orderStatus = status;
    order.updatedAt = new Date();
    return order;
  }

  // Testimonial methods
  async getTestimonials(): Promise<Testimonial[]> {
    return [...this.testimonials];
  }

  async getFeaturedTestimonials(): Promise<Testimonial[]> {
    return this.testimonials.filter(t => t.isActive);
  }

  // Blog methods
  async getBlogPosts(): Promise<BlogPost[]> {
    return [...this.blogPosts];
  }

  async getFeaturedBlogPosts(): Promise<BlogPost[]> {
    return this.blogPosts;
  }

  // Review methods
  async getReviews(): Promise<Review[]> {
    return [...this.reviews];
  }

  async getReviewsByProduct(productId: string): Promise<Review[]> {
    return this.reviews.filter(r => r.productId === productId);
  }

  async getPublishedReviews(): Promise<Review[]> {
    return this.reviews.filter(r => r.isApproved);
  }

  async getPublishedReviewsByProduct(productId: string): Promise<Review[]> {
    return this.reviews.filter(r => r.productId === productId && r.isApproved);
  }

  async createReview(review: InsertReview): Promise<Review> {
    const newReview: Review = {
      id: nanoid(),
      customerName: review.customerName,
      productId: review.productId,
      rating: review.rating,
      comment: review.comment,
      createdAt: new Date(),
      updatedAt: new Date(),
      title: review.title || null,
      customerEmail: review.customerEmail || null,
      isVerified: review.isVerified || null,
      isApproved: review.isApproved || null,
      helpfulCount: review.helpfulCount || null
    };
    this.reviews.push(newReview);
    return newReview;
  }

  async updateReviewStatus(id: string, isPublished: boolean): Promise<void> {
    const review = this.reviews.find(r => r.id === id);
    if (review) {
      review.isApproved = isPublished;
      review.updatedAt = new Date();
    }
  }

  // User methods
  async getAllUsers(): Promise<User[]> {
    return [...this.users];
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.find(u => u.id === id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return this.users.find(u => u.email === email);
  }

  async upsertUser(user: UpsertUser): Promise<User> {
    const existingUser = user.email ? await this.getUserByEmail(user.email) : undefined;
    
    if (existingUser) {
      return this.updateUser(existingUser.id, user);
    } else {
      return this.createUser(user);
    }
  }

  async createUser(user: UpsertUser): Promise<User> {
    const newUser: User = {
      id: user.id || nanoid(),
      email: user.email || null,
      firstName: user.firstName || null,
      lastName: user.lastName || null,
      profileImageUrl: user.profileImageUrl || null,
      role: user.role || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.push(newUser);
    return newUser;
  }

  async updateUser(id: string, user: UpsertUser): Promise<User> {
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) {
      throw new Error('User not found');
    }
    
    this.users[index] = {
      ...this.users[index],
      ...user,
      updatedAt: new Date(),
    };
    return this.users[index];
  }

  async deleteUser(id: string): Promise<void> {
    this.users = this.users.filter(u => u.id !== id);
  }
}

// Database storage implementation
import { db } from "./db";
import { categories, products, orders, testimonials, blogPosts, reviews, users } from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export class DatabaseStorage implements IStorage {
  async getProducts(): Promise<Product[]> {
    console.log("📦 Fetching products from storage...");
    return await db.select().from(products).orderBy(desc(products.createdAt));
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const result = await db.select().from(products).where(eq(products.id, id));
    return result[0];
  }

  async getProductsByCategory(categoryId: string): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.categoryId, categoryId));
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const result = await db.insert(products).values(product).returning();
    return result[0];
  }

  async updateProduct(id: string, product: InsertProduct): Promise<Product> {
    const result = await db.update(products).set(product).where(eq(products.id, id)).returning();
    if (result.length === 0) {
      throw new Error('Product not found');
    }
    return result[0];
  }

  async deleteProduct(id: string): Promise<void> {
    await db.delete(products).where(eq(products.id, id));
  }

  async deleteAllProducts(): Promise<void> {
    await db.delete(products);
  }

  async getCategories(): Promise<Category[]> {
    console.log("📂 Fetching categories from storage...");
    const result = await db.select().from(categories).orderBy(categories.sortOrder);
    console.log(`✅ Found ${result.length} categories`);
    return result;
  }

  async getCategory(id: string): Promise<Category | undefined> {
    const result = await db.select().from(categories).where(eq(categories.id, id));
    return result[0];
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const result = await db.insert(categories).values(category).returning();
    return result[0];
  }

  async updateCategory(id: string, category: InsertCategory): Promise<Category> {
    const result = await db.update(categories).set(category).where(eq(categories.id, id)).returning();
    if (result.length === 0) {
      throw new Error('Category not found');
    }
    return result[0];
  }

  async deleteCategory(id: string): Promise<void> {
    await db.delete(categories).where(eq(categories.id, id));
  }

  async getOrders(): Promise<Order[]> {
    return await db.select().from(orders).orderBy(desc(orders.createdAt));
  }

  async getOrder(id: string): Promise<Order | undefined> {
    const result = await db.select().from(orders).where(eq(orders.id, id));
    return result[0];
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const result = await db.insert(orders).values(order).returning();
    return result[0];
  }

  async updateOrderStatus(id: string, orderStatus: string): Promise<Order> {
    const result = await db.update(orders).set({ orderStatus }).where(eq(orders.id, id)).returning();
    if (result.length === 0) {
      throw new Error('Order not found');
    }
    return result[0];
  }

  async getTestimonials(): Promise<Testimonial[]> {
    return await db.select().from(testimonials).orderBy(testimonials.sortOrder);
  }

  async getFeaturedTestimonials(): Promise<Testimonial[]> {
    return await db.select().from(testimonials).where(eq(testimonials.isActive, true)).orderBy(testimonials.sortOrder);
  }

  async getBlogPosts(): Promise<BlogPost[]> {
    return await db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
  }

  async getFeaturedBlogPosts(): Promise<BlogPost[]> {
    return await db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
  }

  async getReviews(): Promise<Review[]> {
    return await db.select().from(reviews).orderBy(desc(reviews.createdAt));
  }

  async getReviewsByProduct(productId: string): Promise<Review[]> {
    return await db.select().from(reviews).where(eq(reviews.productId, productId)).orderBy(desc(reviews.createdAt));
  }

  async getPublishedReviews(): Promise<Review[]> {
    return await db.select().from(reviews).where(eq(reviews.isApproved, true)).orderBy(desc(reviews.createdAt));
  }

  async getPublishedReviewsByProduct(productId: string): Promise<Review[]> {
    return await db.select().from(reviews)
      .where(eq(reviews.productId, productId))
      .orderBy(desc(reviews.createdAt));
  }

  async createReview(review: InsertReview): Promise<Review> {
    const result = await db.insert(reviews).values(review).returning();
    return result[0];
  }

  async updateReviewStatus(id: string, isApproved: boolean): Promise<void> {
    await db.update(reviews).set({ isApproved }).where(eq(reviews.id, id));
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  }

  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result[0];
  }

  async upsertUser(user: UpsertUser): Promise<User> {
    const existingUser = user.email ? await this.getUserByEmail(user.email) : undefined;
    
    if (existingUser) {
      return this.updateUser(existingUser.id, user);
    } else {
      return this.createUser(user);
    }
  }

  async createUser(user: UpsertUser): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }

  async updateUser(id: string, user: UpsertUser): Promise<User> {
    const result = await db.update(users).set(user).where(eq(users.id, id)).returning();
    if (result.length === 0) {
      throw new Error('User not found');
    }
    return result[0];
  }

  async deleteUser(id: string): Promise<void> {
    await db.delete(users).where(eq(users.id, id));
  }
}

// Create storage instance

// Check if database is available and create appropriate storage
let storage: IStorage;

try {
  // Try to use database storage
  storage = new DatabaseStorage();
  console.log("🔄 Initializing storage with Replit database");
} catch (error) {
  // Fallback to memory storage if database is not available
  console.log("⚠️ Database not available, using memory storage");
  storage = new MemStorage();
}

export { storage };